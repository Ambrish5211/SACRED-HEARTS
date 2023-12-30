from django.urls import path,include

from .views import register_user, user_login

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', user_login, name='login'),
]

