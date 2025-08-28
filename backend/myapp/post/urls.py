from django.urls import path,include
from .views import *
urlpatterns = [
    path('', CensorshipView.as_view(), name='craete_user'),
    path('mypostvalid/',MyPostValid.as_view(),name = "mypostvaild"),
    path('heart/',HeartView.as_view(),name="heartpost"),
] 