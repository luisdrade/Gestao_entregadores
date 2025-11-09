"""
Funções utilitárias para respostas padronizadas da API
"""
import logging

from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger(__name__)


def error_response(message, details=None, status_code=status.HTTP_400_BAD_REQUEST):
    """
    Retorna resposta de erro padronizada
    
    Args:
        message: Mensagem de erro principal
        details: Detalhes adicionais do erro (opcional)
        status_code: Código HTTP de status (padrão: 400)
    
    Returns:
        Response: Resposta DRF formatada
    """
    response = {
        'success': False,
        'error': message
    }
    if details:
        response['details'] = details
    return Response(response, status=status_code)


def success_response(data=None, message=None, status_code=status.HTTP_200_OK):
    """
    Retorna resposta de sucesso padronizada
    
    Args:
        data: Dados a serem retornados (opcional)
        message: Mensagem de sucesso (opcional)
        status_code: Código HTTP de status (padrão: 200)
    
    Returns:
        Response: Resposta DRF formatada
    """
    response = {'success': True}
    if message:
        response['message'] = message
    if data:
        if isinstance(data, dict):
            response.update(data)
        else:
            response['data'] = data
    return Response(response, status=status_code)
