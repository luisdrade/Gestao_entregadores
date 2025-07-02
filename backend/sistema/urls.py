"""
URL configuration for sistema project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView, )

urlpatterns = [
    path('admin/', admin.site.urls),

    # Suas APIs existentes
    path('api/', include('usuarios.urls')),

    # Endpoints de autenticação (login/logout/cadastro/change password)
    path('api/auth/', include('dj_rest_auth.urls')),

    # Registro de novos usuários
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),

    # Endpoints de login social
    path('api/auth/social/', include('allauth.socialaccount.urls')),
    
    #app de usuarios
    path('usuarios/', include('usuarios.urls')),
]
