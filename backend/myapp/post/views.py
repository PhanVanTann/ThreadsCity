from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from .services import ImageCensorshipService

# Create your views here.
class ImageCensorshipView(APIView):
    def post(self, request):
        url = request.data.get('url')
        postid = request.data.get('postid')
        print("Received URL:", url, "and Post ID:", postid)
        if not url or not postid:
            return JsonResponse({"error": "Image URL and post ID are required"}, status=400)

        image_censorship_service = ImageCensorshipService()

        result = image_censorship_service.image_censorship(url, postid)
        print("Image Censorship Result:", result)
        if result['success']:
            return JsonResponse(result, status=200)
        else:
            return JsonResponse({"error": result['error']}, status=500)