from rest_framework import serializers
from Movies.models import Movies


class Movie_Serializer(serializers.HyperlinkedModelSerializer):
    movie_id= serializers.ReadOnlyField()
    class Meta:
        model = Movies
        fields = '__all__'
        extra_kwargs = {
            'thumbnail': {'required': False},
        }