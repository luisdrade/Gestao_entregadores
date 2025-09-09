from django.urls import path
from django.views.generic import TemplateView
from .admin_views import AdminDashboardView
from .web_views import custom_login_view

app_name = 'auth_templates'

urlpatterns = [
    # Templates HTML de autenticação
    path('login/', custom_login_view, name='login'),
    path('register/', TemplateView.as_view(template_name='usuarios/register.html'), name='register'),
    
    # Dashboard do admin
    path('admin/', AdminDashboardView.as_view(), name='admin_dashboard'),
]
