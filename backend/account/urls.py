from django.urls import path
from account.views import  UserLoginView,  UserRegistrationView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),

]