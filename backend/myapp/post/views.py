from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from .services import CensorshipService

# Create your views here.
class CensorshipView(APIView):
    def post(self, request):
        data = request.data
        censorship_service = CensorshipService()

        result = censorship_service.create_post(data)
        print("Image Censorship Result:", result)
        if result['success']:
            return JsonResponse(result, status=200)
        else:
            return JsonResponse({"error": result['error']}, status=500)