from django.shortcuts import render
from rest_framework import viewsets
from Movies.serializers import Movie_Serializer
from Movies.models import Movies

# Create your views here.


class MoviesViewSet(viewsets.ModelViewSet):
    queryset = Movies.objects.all()
    serializer_class = Movie_Serializer



