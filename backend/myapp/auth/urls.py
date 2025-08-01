
from django.urls import path,include
from .views import *
urlpatterns = [
    path('verifyEmail/', EmailView.as_view(), name='verify_email'),
    path('login/', LoginView.as_view(), name='login'),
] 