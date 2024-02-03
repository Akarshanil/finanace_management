# serializers.py
from rest_framework import serializers
from .models import ExpenseRequest
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email']  # Include any other fields you want to expose

class ExpenseRequestSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Nested serializer for the user field

    class Meta:
        model = ExpenseRequest
        fields = ['id', 'user', 'name', 'date_of_expense', 'category', 'amount', 'created_at', 'updated_at']
