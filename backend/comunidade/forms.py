from django import forms
from .models import Topico, Comentario, AnuncioVeiculo

class TopicoForm(forms.ModelForm):
    class Meta:
        model = Topico
        fields = ['titulo', 'descricao']

class ComentarioForm(forms.ModelForm):
    class Meta:
        model = Comentario
        fields = ['texto']

class AnuncioVeiculoForm(forms.ModelForm):
    class Meta:
        model = AnuncioVeiculo
        fields = ['modelo', 'ano', 'quilometragem', 'preco', 'localizacao', 'link', 'foto']
