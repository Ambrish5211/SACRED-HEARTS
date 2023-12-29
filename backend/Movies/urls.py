from django.urls import path,include
from rest_framework import routers
from Movies.views import MoviesViewSet


router = routers.DefaultRouter()
router.register(r'movies', MoviesViewSet)

urlpatterns= [
    path('', include(router.urls))
]