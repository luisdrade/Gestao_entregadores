# Generated by Django 5.2.3 on 2025-07-08 02:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0003_entregador_data_nascimento'),
    ]

    operations = [
        migrations.AlterField(
            model_name='entregador',
            name='cpf',
            field=models.CharField(blank=True, max_length=14, null=True, unique=True),
        ),
    ]
