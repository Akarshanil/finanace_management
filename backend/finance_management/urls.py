from django.urls import path
from . import views

urlpatterns = [
        path('authenticate/', views.UserAuthenticationAPIView.as_view(), name='authenticate'),
        path('expense_requests/',views.ExpenseRequestAPIView.as_view(), name='expense_request_api'),
        path('expense_requests_upd/<int:expense_id>/', views.ExpenseRequestUpdateAPIView.as_view(), name='expense_request_update'),




]
