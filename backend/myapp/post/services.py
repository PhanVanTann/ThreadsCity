import requests
import cloudinary.uploader
from datetime import datetime
from utils.mogodbConnet import mongo
from django.conf import settings
from bson import ObjectId

class collection:
    def __init__(self):
        self.post_collection = mongo.get_collection('posts')
        self.censorship_collection = mongo.get_collection('censorships')
        self.user_collection = mongo.get_collection('users')
    def get_post_collection(self):
        return self.post_collection
    def get_censorship_collection(self):
        return self.censorship_collection
    def get_user_collection(self): 
        return self.user_collection

class CensorshipService(collection):
    def __init__(self):
        super().__init__()
        self.post_collection = self.get_post_collection()
        self.censorship_collection = self.get_censorship_collection()
        self.user_collection = self.get_user_collection()
    def image_censorship(self,url,postid):
        print("Image Censorship Service called with URL:", url, "and post ID:", postid)
        try:
            result = requests.post('http://127.0.0.1:8001/ai/predict_image', json={
                "url": url,
                'postid': postid
                })
            print("Image Censorship Result:", result.json())     
            return {"success": True, "message": "Image censorship completed successfully", "data": result.json()}
        except Exception as e:
            return {
                "message": "Error in image censorship",
                "postid": postid,
                "error": str(e)
            }
        
    def create_post(self, data):
        print(settings.CLOUD_NAME, settings.API_KEY, settings.API_SECRET)
        media_file = data.get("media") 
        upload_result = cloudinary.uploader.upload(media_file,resource_type="auto")
        media_url = upload_result.get("secure_url")
        post_data = {
            "user_id": data.get("user_id"),
            "text": data.get("text"),
            "media":media_url,
            "flag": False,
            "status": "uncensored",
            "total_love": 0,
            "total_comment": 0,
            "created_at": datetime.now(),
        }

        try:
            user_data = self.user_collection.find_one({"_id": ObjectId(data.get("user_id"))})
            if not user_data:
                return {"success": False, "error": "User not found."}
            post_info = self.post_collection.insert_one(post_data)
            postid = str(post_info.inserted_id)
            if not postid:
                return {"success": False, "error": "Failed to create post."}
            result = self.image_censorship(media_url, postid)
            data_Isvalid = ["NonViolence"]
            data = result['data']
            censoreds = []
            valids = []
            awaiting_censorship = []
            for item in data['result']:
                if item['result'] == None or item['result']['label'] in data_Isvalid:
                    continue
                if item['result']['conf'] >= 0.8:
                    self.censorship_collection.insert_one({
                        "post_id": postid,
                        "label": item['result']['label'],
                        "confidence": item['result']['conf'],
                        "image_url": item['cloud_url'],
                        "status": "censored",
                        "created_at": datetime.now()
                    })
                    data = {
                        "post_id": postid,
                        "label": item['result']['label'],
                        "confidence": item['result']['conf'],
                        "image_url": item['cloud_url'],
                        "status": "censored",
                        "created_at": datetime.now()
                    }
                    censoreds.append(data)
                    
                elif item['result']['conf'] < 0.8 and item['result']['conf'] >0.65:
                    self.censorship_collection.insert_one({
                        "post_id": postid,
                        "label": item['result']['label'],
                        "confidence": item['result']['conf'],
                        "image_url": item['cloud_url'],
                        "status": "awaiting censorship",
                        "created_at": datetime.now()
                    })
                    data = {
                        "post_id": postid,
                        "label": item['result']['label'],
                        "confidence": item['result']['conf'],
                        "image_url": item['cloud_url'],
                        "status": "awaiting censorship",
                        "created_at": datetime.now()
                    }
                    awaiting_censorship.append(data)
                else:
                    self.censorship_collection.insert_one({
                        "post_id": postid,
                        "label": item['result']['label'],
                        "confidence": item['result']['conf'],
                        "image_url": item['cloud_url'],
                        "status": "valid",
                        "created_at": datetime.now()
                    })
                    data = {
                        "post_id": postid,
                        "label": item['result']['label'],
                        "confidence": item['result']['conf'],
                        "image_url": item['cloud_url'],
                        "status": "valid",
                        "created_at": datetime.now()
                    }
                    valids.append(data)
            if censoreds:
                self.post_collection.update_one(
                    {"_id": ObjectId(postid)},
                    {"$set": {"status": "not vaid"}}
                )
                return {
                    "success": True,
                    "message": "Your post has been violated",
                    "status": "not vaid",
                    "post_id": postid,

                }
            elif awaiting_censorship and not censoreds:
                self.post_collection.update_one(
                    {"_id": ObjectId(postid)},
                    {"$set": {"status": "awaiting","flag": True}}
                )
                return {
                    "success": True,
                    "message": "Your post is potentially infringing. Please wait for moderation",
                    "status": "awaiting",
                    "post_id": postid,
                }
            elif valids and not censoreds and not awaiting_censorship:
                self.post_collection.update_one(
                    {"_id": ObjectId(postid)},
                    {"$set": {"status": "valid"}} 
                )
            return {"success": True, "message": "Post created successfully", "status": "valid", "post_id": postid}
        except Exception as e:
            return {
                "message": "Error in image censorship",
                "postid": postid,
                "error": str(e)
            }