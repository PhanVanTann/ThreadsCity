from django.urls import path,include
from .views import *
urlpatterns = [
    path('imagecensorship/', ImageCensorshipView.as_view(), name='craete_user'),
] 