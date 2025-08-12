from django.shortcuts import render
from rest_framework.views import APIView
from django.http import JsonResponse
from .services import ChatService, MessageService
chatservice = ChatService()
messageService = MessageService()
# Create your views here.
class ChatView(APIView):
    def post(self,request):
        user_id1 = request.data.get('user_id1')
        user_id2 = request.data.get('user_id2')
        result = chatservice.create_roomchat(user_id1,user_id2)
        return JsonResponse(result,status = 201)
