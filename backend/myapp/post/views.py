from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from .services import CensorshipService
censorship_service = CensorshipService()
# Create your views here.
class CensorshipView(APIView):
    
    def post(self, request):
        data={
            "user_id" : request.data.get('user_id'),
            "text"    : request.data.get('text'),
            "media"   : request.FILES.get('media'), 
        }
        
        result = censorship_service.create_post(data)
        print("Image Censorship Result:", result)
        if result['success']:
            return JsonResponse(result, status=201)
        else:
            return JsonResponse({"error": result['error']}, status=500)
    
    def get(self,request):
        result  = censorship_service.get_listpost()
        return JsonResponse(result, status=200)
class MyPostValid(APIView):
    def get(self,request):
        user_id = request.GET.get("user_id")
        result = censorship_service.getPostValidByUser(user_id)
        return JsonResponse(result, status=200)