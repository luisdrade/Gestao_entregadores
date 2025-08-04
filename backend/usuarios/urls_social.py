# usuarios/urls_social.py
from django.urls import path
from .views_social import GoogleLogin

urlpatterns = [
    path('', GoogleLogin.as_view(), name='google_login'),
]