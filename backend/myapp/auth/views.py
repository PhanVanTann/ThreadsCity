from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from .services import emailService
from utils.jwt import decode_token
from .services import LoginService
from utils.jwt import create_cookie
import json
# Create your views here.
class EmailView(APIView):
    def get(self, request):
        token = request.GET.get('token')
        if not token:
            return JsonResponse({"error": "Token is required"}, status=400)

        try:
            decoded_data = decode_token(token)
            if isinstance(decoded_data, dict) and decoded_data.get("error"):
                return JsonResponse({"error": f"Invalid token: {decoded_data['error']}"}, status=401)
            email = decoded_data.get('email')
            if not email:
                return JsonResponse({"error": "email not in token"}, status=400)

            email_service = emailService()
            user = email_service.verify_email_token(email)

            if user:
                return JsonResponse({"success":True,"message": "Email is verify!"},status = 200)
            else:
                return JsonResponse({"success":False,"error": "unverified Email"}, status=400)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        if not email or not password:
            return JsonResponse({"error": "Email and password are required"}, status=400)

        login_service = LoginService()
        login_response = login_service.login(email, password)

        if login_response['success']:
            access_token = login_response["access_token"]
            refresh_token = login_response["refresh_token"]
            response = create_cookie(access_token,refresh_token)
            response.content = json.dumps(login_response) 
            response['Content-Type'] = 'application/json'
            return JsonResponse(login_response, status=200)
        else:
            return JsonResponse({"error": login_response['message']}, status=401)