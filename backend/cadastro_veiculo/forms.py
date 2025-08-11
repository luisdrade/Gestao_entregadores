from django import forms
from .models import Veiculo

class VeiculoForm(forms.ModelForm):
    class Meta:
        model = Veiculo
        fields = ['placa', 'modelo', 'categoria', 'tipo', 'km_por_l']
