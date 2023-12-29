# Generated by Django 3.2.19 on 2023-12-29 19:40

import cloudinary_storage.storage
import cloudinary_storage.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Movies', '0014_auto_20231230_0055'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movies',
            name='sample_video',
            field=models.FileField(blank=True, null=True, storage=cloudinary_storage.storage.VideoMediaCloudinaryStorage(), upload_to='Movies_app/sample_videos/', validators=[cloudinary_storage.validators.validate_video]),
        ),
        migrations.AlterField(
            model_name='movies',
            name='trailer',
            field=models.FileField(blank=True, null=True, storage=cloudinary_storage.storage.VideoMediaCloudinaryStorage(), upload_to='Movies_app/trailers/', validators=[cloudinary_storage.validators.validate_video]),
        ),
    ]
