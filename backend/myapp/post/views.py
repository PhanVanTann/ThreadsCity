from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from .services import CensorshipService

# Create your views here.
class CensorshipView(APIView):
    censorship_service = CensorshipService()
    def post(self, request):
        data={
            "user_id" : request.data.get('user_id'),
            "text"    : request.data.get('text'),
            "media"   : request.FILES.get('media'), 
        }
        
        result = self.censorship_service.create_post(data)
        print("Image Censorship Result:", result)
        if result['success']:
            return JsonResponse(result, status=201)
        else:
            return JsonResponse({"error": result['error']}, status=500)
    
    def get(self,request):
        result  = self.censorship_service.get_listpost()
        return JsonResponse(result, status=200)