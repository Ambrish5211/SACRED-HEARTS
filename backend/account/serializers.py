from rest_framework import serializers
from account.models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator

class UserRegistrationSerializer(serializers.ModelSerializer):
  
  class Meta:
    model = User
    fields=['email', 'username', 'password', ]
    extra_kwargs={
      'password':{'write_only':True}
    }

  def create(self, validate_data):
    return User.objects.create_user(**validate_data)

class UserLoginSerializer(serializers.ModelSerializer):
  email = serializers.EmailField(max_length=255)
  class Meta:
    model = User
    fields = ['email', 'password']

