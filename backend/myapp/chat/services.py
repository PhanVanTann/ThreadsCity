from utils.mogodbConnet import mongo
from bson import ObjectId
from datetime import datetime
import cloudinary.uploader
class collection:
    def __init__(self):
        self.roomchat_conlection = mongo.get_collection('roomchats')
        self.user_collection = mongo.get_collection('users')
        self.message_collection = mongo.get_collection('messages')
    def get_roomchat_conletion(self):
        return self.roomchat_conlection
    def get_user_collection(self): 
        return self.user_collection
    def get_message_colletion(self):
        return self.message_collection
class ChatService(collection):
    def __init__(self):
        super().__init__()
        self.message_collection = self.get_message_colletion()
        self.user_collection = self.get_user_collection()
    def create_roomchat(self,user_id1,user_id2):
        user1 = self.user_collection.find_one({'_id':ObjectId(user_id1)})
        user2 = self.user_collection.find_one({'_id':ObjectId(user_id2)})
        if not user1 and not user2:
            return {"success":False,"message":"user_id not valid" }
        members = sorted([ObjectId(user_id1), ObjectId(user_id2)], key=lambda x: str(x))
        try:
            room_data = self.roomchat_conlection.find_one({
                "members": {
                    "$all": members
                }
            })
            if not room_data:
                room = self.roomchat_conletion.insert_one({'members':members, "created_at": datetime.now(),}) 
                room_id = str(room.inserted_id)
                return {"success":True,"room_id":room_id}
            return {"success":True,"room_id":str(room_data['_id'])}
        except Exception as e:
            return{"success":False,"message":str(e)}
        
class MessageService(collection):
    def __init__(self):
        super().__init__()
        self.message_colletion = self.get_message_colletion()
        self.user_collection = self.get_user_collection()
    def create_message(self,room_id,send_id,receiver_id,text,media):
        media_url = None
        if media:
            media_file = media 
            upload_result = cloudinary.uploader.upload(media_file,resource_type="auto")
            media_url = upload_result.get("secure_url")
        
        message_doc = {
            "room_id": ObjectId(room_id),
            "send_id": ObjectId(send_id),
            "receiver_id": ObjectId(receiver_id),
            "text": text,
            "media": media_url,
            "created_at": datetime.now()
        }
        self.message_collection.insert_one(message_doc)
        return {"success": True, "message": "Message created"}
        
