# Generated by Django 3.2.19 on 2023-12-29 19:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Movies', '0013_auto_20231230_0052'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movies',
            name='sample_video',
            field=models.FileField(blank=True, null=True, upload_to='Movies_app/sample_videos/'),
        ),
        migrations.AlterField(
            model_name='movies',
            name='trailer',
            field=models.FileField(blank=True, null=True, upload_to='Movies_app/trailers/'),
        ),
    ]
