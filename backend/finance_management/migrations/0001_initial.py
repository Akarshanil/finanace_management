# Generated by Django 5.0.1 on 2024-02-01 16:46

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ExpenseRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=140, verbose_name='Name of the Expense Request')),
                ('date_of_expense', models.DateField(verbose_name='Date of Expense')),
                ('category', models.CharField(choices=[('Health', 'Health'), ('Electronics', 'Electronics'), ('Travel', 'Travel'), ('Education', 'Education'), ('Books', 'Books'), ('Others', 'Others')], max_length=20, verbose_name='Category')),
                ('description', models.TextField(verbose_name='Description')),
                ('amount', models.PositiveIntegerField(verbose_name='Amount')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Created at')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Updated at')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='expense_requests', to=settings.AUTH_USER_MODEL, verbose_name='User')),
            ],
        ),
    ]
