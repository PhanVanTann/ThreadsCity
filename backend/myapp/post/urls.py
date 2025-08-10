from django.urls import path,include
from .views import *
urlpatterns = [
    path('', CensorshipView.as_view(), name='craete_user'),
] 