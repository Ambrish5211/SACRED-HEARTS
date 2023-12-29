# Generated by Django 3.2.19 on 2023-12-29 17:18

import cloudinary.models
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Movies', '0005_auto_20231229_2245'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movies',
            name='thumbnail',
            field=cloudinary.models.CloudinaryField(max_length=255, null=True, verbose_name='Image'),
        ),
    ]
