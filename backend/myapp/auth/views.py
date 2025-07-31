from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from .services import emailService
from utils.jwt import decode_token
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