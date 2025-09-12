from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.utils import timezone
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.mail import send_mail
from django.conf import settings
import random
import logging
from .models import Entregador

logger = logging.getLogger(__name__)

def send_validation_email(user):
    """Envia email de validação para o usuário"""
    try:
        # Gerar código de 6 dígitos
        codigo = str(random.randint(100000, 999999))
        
        # Definir expiração (15 minutos)
        expira_em = timezone.now() + timezone.timedelta(minutes=15)
        
        # Salvar código no usuário
        user.email_codigo_validacao = codigo
        user.email_codigo_expira_em = expira_em
        user.save()
        
        # Enviar email
        subject = 'Código de Validação - Sistema de Gestão de Entregadores'
        message = f"""
        Olá {user.nome},
        
        Seu código de validação é: {codigo}
        
        Este código expira em 15 minutos.
        
        Se você não solicitou esta validação, ignore este email.
        
        Atenciosamente,
        Equipe do Sistema
        """
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        
        logger.info(f"Email de validação enviado para {user.email} com código {codigo}")
        return True
        
    except Exception as e:
        logger.error(f"Erro ao enviar email de validação: {str(e)}")
        return False

@login_required
def email_validation_view(request):
    """View para validação de email"""
    user = request.user
    
    # Se já está validado, redirecionar para dashboard
    if user.email_validado:
        return redirect('admin:index')
    
    # Se é admin, não precisa validar
    if user.is_staff:
        return redirect('admin:index')
    
    if request.method == 'POST':
        codigo = request.POST.get('codigo', '').strip()
        
        if not codigo:
            messages.error(request, 'Por favor, digite o código de validação.')
            return render(request, 'usuarios/email_validation.html', {'user': user})
        
        # Verificar se o código está correto e não expirou
        if (user.email_codigo_validacao == codigo and 
            user.email_codigo_expira_em and 
            timezone.now() <= user.email_codigo_expira_em):
            
            # Validar email
            user.email_validado = True
            user.email_codigo_validacao = None
            user.email_codigo_expira_em = None
            user.save()
            
            messages.success(request, 'Email validado com sucesso!')
            return redirect('admin:index')
        else:
            messages.error(request, 'Código inválido ou expirado. Tente novamente.')
    
    return render(request, 'usuarios/email_validation.html', {'user': user})

@login_required
@require_http_methods(["POST"])
def resend_validation_code(request):
    """Reenvia código de validação"""
    user = request.user
    
    if user.email_validado:
        return JsonResponse({'success': False, 'message': 'Email já está validado'})
    
    if send_validation_email(user):
        return JsonResponse({'success': True, 'message': 'Código reenviado com sucesso!'})
    else:
        return JsonResponse({'success': False, 'message': 'Erro ao enviar código. Tente novamente.'})

def custom_login_view(request):
    """View customizada de login que verifica validação de email"""
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        if not email or not password:
            messages.error(request, 'Por favor, preencha todos os campos.')
            return render(request, 'usuarios/login.html')
        
        user = authenticate(request, email=email, password=password)
        
        if user is not None:
            if user.is_active:
                login(request, user)
                
                # Se é admin, redirecionar direto para admin
                if user.is_staff:
                    return redirect('admin:index')
                
                # Se não é admin e email não está validado, enviar código e mostrar tela de validação
                if not user.email_validado:
                    send_validation_email(user)
                    messages.info(request, 'Um código de validação foi enviado para seu email.')
                    return redirect('usuarios:email_validation')
                
                # Se email está validado, redirecionar para admin
                return redirect('admin:index')
            else:
                messages.error(request, 'Conta desativada.')
        else:
            messages.error(request, 'Email ou senha incorretos.')
    
    return render(request, 'usuarios/login.html')
