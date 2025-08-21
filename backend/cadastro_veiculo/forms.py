from django import forms
from .models import Veiculo

class VeiculoForm(forms.ModelForm):
    class Meta:
        model = Veiculo
        fields = ['tipo', 'modelo', 'placa', 'categoria', 'km_por_l']
        widgets = {
            'tipo': forms.Select(attrs={'class': 'form-control'}),
            'modelo': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Digite o modelo do veículo'}),
            'placa': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Digite a placa (opcional)'}),
            'categoria': forms.Select(attrs={'class': 'form-control'}),
            'km_por_l': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': '0.0', 'step': '0.1', 'min': '0'}),
        }
