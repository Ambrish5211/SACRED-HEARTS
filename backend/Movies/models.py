from django.db import models
from cloudinary.models import CloudinaryField
from cloudinary_storage.storage import VideoMediaCloudinaryStorage
from cloudinary_storage.validators import validate_video



# Create your models here.

class Movies(models.Model):
    title = models.CharField(max_length=255, default="default")
    movie_id= models.AutoField(primary_key=True)
    description = models.TextField(default= "default")
    release_date = models.DateField(null=True, auto_now = True)
    duration_minutes = models.PositiveIntegerField(default = 0)
    genres = models.CharField(max_length=100, choices=
                              (('Fantasy', 'Fantasy'),
                               ('Adventure', 'Adventure'),
                               ('SCIFi', 'SCiFI'),
                               ('Fiction', 'Fiction'),
                               ('Thriller', 'Thriller'),
                               ('Mystery', 'Mystery'),
                              ), default = "Fantasy")
    thumbnail = models.FileField(upload_to='Movies_app/', null=True, blank=True)
    trailer = models.FileField(upload_to='Movies_app/trailers/', null=True, blank=True,storage=VideoMediaCloudinaryStorage(),
                              )
    sample_video = models.FileField(upload_to='Movies_app/sample_videos/', null=True, blank=True, storage=VideoMediaCloudinaryStorage(),
                              )



    def __str__(self):
        return self.title

    


# realease dates