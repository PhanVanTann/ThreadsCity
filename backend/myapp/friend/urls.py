from django.urls import path,include
from .views import *
urlpatterns = [
    path('', FriendView.as_view(), name='craete_flower'),
    
] 