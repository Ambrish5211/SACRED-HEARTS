from django.db import models
from django.contrib.auth.models import BaseUserManager,AbstractBaseUser




class UserManager(BaseUserManager):
  def create_user(self, email, username, password=None):
      
      if not email:
          raise ValueError('User must have an email address')

      user = self.model(
          email=self.normalize_email(email),
          username=username,
      )

      user.set_password(password)
      user.save(using=self._db)
      return user

  def create_superuser(self, email, username,password=None):
      
      user = self.create_user(
          email,
          password=password,
          username=username,
      )
      user.is_admin = True
      user.save(using=self._db)
      return user

class User(AbstractBaseUser):
  email = models.EmailField(
      verbose_name='Email',
      max_length=255,
      unique=True,
  )
  username = models.CharField(max_length=200)
  is_active = models.BooleanField(default=True)
  is_admin = models.BooleanField(default=False)
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)

  objects = UserManager()

  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = ['username']

  def __str__(self):
      return self.email

  def has_perm(self, perm, obj=None):
      "Does the user have a specific permission?"
      return self.is_admin

  def has_module_perms(self, app_label):
      "Does the user have permissions to view the app `app_label`?"
      return True

  @property
  def is_staff(self):
      "Is the user a member of staff?"
      # Simplest possible answer: All admins are staff
      return self.is_admin



