# Generated by Django 5.0.1 on 2024-02-03 05:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finance_management', '0005_remove_expenserequest_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='expenserequest',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, null=True),
        ),
    ]