from django.urls import path
from .views import *

urlpatterns = [
    path('roomchat/', ChatView.as_view(),name="chatroom"),
]