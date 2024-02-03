from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from datetime import timedelta



CATEGORY_CHOICES = [
    ('Health', 'Health'),
    ('Electronics', 'Electronics'),
    ('Travel', 'Travel'),
    ('Education', 'Education'),
    ('Books', 'Books'),
    ('Others', 'Others'),
]

class ExpenseRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expense_requests', verbose_name='User')
    name = models.CharField(max_length=140, verbose_name='Name of the Expense Request')
    date_of_expense = models.DateField(verbose_name='Date of Expense')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, verbose_name='Category')
    amount = models.PositiveIntegerField(verbose_name='Amount')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Created at')
    updated_at = models.DateTimeField(auto_now=True,null=True)

    