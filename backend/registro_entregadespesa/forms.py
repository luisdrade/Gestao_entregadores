from django import forms
from .models import RegistroEntregaDespesa

class RegistroEntregaDespesaForm(forms.ModelForm):
    class Meta:
        model = RegistroEntregaDespesa
        fields = [
            'tipo_rendimento',
            'valor_unitario',
            'valor_diaria',
            'total_pacotes',
            'pacotes_entregues',
            'pacotes_nao_entregues',
            'categoria_despesa',
            'valor_despesa',
            'descricao_outros',
        ]

    def clean(self):
        cleaned_data = super().clean()
        tipo = cleaned_data.get('tipo_rendimento')
        valor_unitario = cleaned_data.get('valor_unitario')
        valor_diaria = cleaned_data.get('valor_diaria')
        categoria = cleaned_data.get('categoria_despesa')
        valor_despesa = cleaned_data.get('valor_despesa')
        descricao_outros = cleaned_data.get('descricao_outros')

        # Validar apenas o campo necessário
        if tipo == 'unitario':
            if not valor_unitario:
                self.add_error('valor_unitario', 'Informe o valor por pacote.')
            cleaned_data['valor_diaria'] = None
        elif tipo == 'diaria':
            if not valor_diaria:
                self.add_error('valor_diaria', 'Informe o valor da diária.')
            cleaned_data['valor_unitario'] = None
        else:
            self.add_error('tipo_rendimento', 'Escolha um tipo de rendimento.')

        # Despesa: se for "nenhuma", valor é zero
        if categoria == 'nenhuma':
            cleaned_data['valor_despesa'] = 0.0
            cleaned_data['descricao_outros'] = ''
        elif categoria == 'outros' and not descricao_outros:
            self.add_error('descricao_outros', 'Descreva o tipo de despesa "Outros".')

