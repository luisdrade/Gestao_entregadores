from django import forms
from .models import Entregador

class EntregadorForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    confirma_senha = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = Entregador
        fields = ['nome', 'cpf', 'telefone', 'email', 'password', 'confirma_senha']

    def clean(self):
        cleaned_data = super().clean()
        senha = cleaned_data.get("password")
        confirma = cleaned_data.get("confirma_senha")

        if senha and confirma and senha != confirma:
            raise forms.ValidationError("As senhas não coincidem.")
