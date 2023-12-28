from django.db import models

# Create your models here.

class Movies(models.Model):
    movie_id= models.AutoField(primary_key=True)
    title= models.CharField(max_length= 50, null=True)
    description = models.CharField(max_length = 200, null= True )
    genre = models.CharField(max_length=20, null=True)
    added_date= models.DateTimeField(auto_now=True)



# realease dates