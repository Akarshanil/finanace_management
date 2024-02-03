from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ExpenseRequestSerializer,UserSerializer
from django.contrib.auth import get_user_model
from .models import ExpenseRequest
from django.contrib.auth.models import User
import json
from datetime import datetime



class UserAuthenticationAPIView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if email is None or password is None:
            return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        User = get_user_model()

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)

        if user.check_password(password):
            return Response({'user': {'id': user.id, 'email': user.email}}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
class ExpenseRequestAPIView(APIView):
    def post(self, request):
        try:
            request_body = json.loads(request.body)
            userId = request_body.get('userId')
            authenticated_user = User.objects.get(id=userId)
            
            expense_data = {
                'user': authenticated_user,
                'name': request_body.get('expenseData', {}).get('name'),
                'date_of_expense': request_body.get('expenseData', {}).get('date_of_expense'),
                'category': request_body.get('expenseData', {}).get('category'),
                'amount': request_body.get('expenseData', {}).get('amount'),

            }
            expense_request = ExpenseRequest(**expense_data)
            expense_request.save()

            message = "Expense created successfully!"
            return Response({"message": message}, status=status.HTTP_201_CREATED)
        
        except User.DoesNotExist:
            message = "User with provided ID does not exist."
            return Response({"message": message}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            message = "An error occurred while processing the request."
            return Response({"message": message, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def get(self, request):
        loginuser = request.query_params.get('userid', '')  
        search_data = request.query_params.get('query', '')  
        filter_data = request.query_params.get('filter_data', '')  
        logged_in_user=User.objects.get(id=loginuser)
        if search_data:
            if logged_in_user.is_superuser:
                expense_requests = ExpenseRequest.objects.filter(name__icontains=search_data)
                serializer = ExpenseRequestSerializer(expense_requests, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                expense_requests = ExpenseRequest.objects.filter(name__icontains=search_data, user=logged_in_user)
                serializer = ExpenseRequestSerializer(expense_requests, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)

        elif filter_data:
            date_format = '%a %b %d %Y %H:%M:%S GMT%z (%Z)'
            date_object = datetime.strptime(filter_data, date_format)
            formatted_date = date_object.strftime("%Y-%m-%d")
            print("Formatted date:", formatted_date)
            if formatted_date is not None:
                if logged_in_user.is_superuser:
                    expense_requests = ExpenseRequest.objects.filter(date_of_expense=formatted_date)
                    serializer = ExpenseRequestSerializer(expense_requests, many=True)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                else:
                    expense_requests = ExpenseRequest.objects.filter(date_of_expense=formatted_date,user=logged_in_user)
                    serializer = ExpenseRequestSerializer(expense_requests, many=True)
                    return Response(serializer.data, status=status.HTTP_200_OK)
                    
            else:
                return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            if logged_in_user.is_superuser:
                expense_requests = ExpenseRequest.objects.all()
                serializer = ExpenseRequestSerializer(expense_requests, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                expense_requests = ExpenseRequest.objects.filter(user=logged_in_user)
                serializer = ExpenseRequestSerializer(expense_requests, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
class ExpenseRequestUpdateAPIView(APIView):
    def put(self, request, expense_id):
        try:
            expense_request = ExpenseRequest.objects.get(id=expense_id)
            request_data = json.loads(request.body)
            user_id = request_data.get('userId')
            if user_id != expense_request.user.id:
                return Response({"message": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)
            name = request_data.get('expenseData', {}).get('name')
            date_of_expense = request_data.get('expenseData', {}).get('date_of_expense')
            category = request_data.get('expenseData', {}).get('category')
            amount = request_data.get('expenseData', {}).get('amount')
            ExpenseRequest.objects.filter(id=expense_id).update(name=name,date_of_expense=date_of_expense,category=category,amount=amount)
            return Response({"message": "Expense updated successfully!"}, status=status.HTTP_200_OK)

        except ExpenseRequest.DoesNotExist:
            return Response({"message": "Expense with provided ID does not exist."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"message": "An error occurred while processing the request.", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def delete(self, request, expense_id):
        obj = ExpenseRequest.objects.get(id=expense_id)
        obj.delete()
        return Response("data deleted",status=status.HTTP_204_NO_CONTENT)



