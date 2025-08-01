from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from .services import userService


class UserView(APIView):
    def get(self, request,*args, **kwargs):
        return JsonResponse({"message": "User data retrieved successfully."})

    def post(self, request,*args, **kwargs): 
        user_data = request.data
        user_infor = userService.create_user(user_data)
        if not user_infor:
            return JsonResponse({"error": "Failed to create user."}, status=400)      
        return JsonResponse(user_infor, status=201)
