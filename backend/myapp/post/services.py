import requests
import cloudinary.uploader
from datetime import datetime
from utils.mogodbConnet import mongo
from django.conf import settings
from bson import ObjectId
from concurrent.futures import ThreadPoolExecutor


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
    def text_censorship(self,text,postid):
        try:
            result = requests.post('http://127.0.0.1:8001/ai/predict_text',json={
                "text":text,
                "postid":postid
            })
            return {"success": True, "message": "text censorship completed successfully", "data": result.json()}
        except Exception as e:
            return {
                "message": "Error in image censorship",
                "postid": postid,
                "error": str(e)
            }
    def create_post(self, data):
        user_id = data.get("user_id")
        text_content = (data.get("text") or "").strip()
        media_file = data.get("media")

        # Upload media (nếu có) và xác định loại
        media_url = None
        media_type = None
        if media_file:
            up = cloudinary.uploader.upload(media_file, resource_type="auto")
            media_url = up.get("secure_url")
            media_type = up.get("resource_type")  # 'image' | 'video'

        text_present = bool(text_content)

        post_data = {
            "user_id": user_id,
            "text": text_content if text_present else None,
            "media": media_url,
            "is_video": bool(media_type == "video"),
            "flag": False,
            "status": "uncensored",
            "total_love": 0,
            "total_comment": 0,
            "created_at": datetime.now(),
        }

        try:
            user = self.user_collection.find_one({"_id": ObjectId(user_id)})
            if not user:
                return {"success": False, "error": "User not found."}

            post_info = self.post_collection.insert_one(post_data)
            postid = str(post_info.inserted_id)

            def run_media():
                if not media_url or not media_type:
                    return None
                return self.image_censorship(media_url, postid)

            def run_text():
                if not text_present:
                    return None
                return self.text_censorship(text_content, postid)  

            media_result = None
            text_result = None

            if media_url and text_present:
                with ThreadPoolExecutor(max_workers=2) as ex:
                    f_media = ex.submit(run_media)
                    f_text  = ex.submit(run_text)
                    media_result = f_media.result()
                    text_result  = f_text.result()
                    print("media_result",media_result)
                    print("text_result",text_result)
            elif media_url:
                media_result = run_media()
            elif text_present:
                text_result = run_text()
            else:
                return {"success": False, "error": "No content provided."}

            data_Isvalid = ["NonViolence"]
            censoreds, awaiting, valids = [], [], []

            if media_result and "data" in media_result:
                img_payload = media_result["data"]
                for item in img_payload.get("result", []):
                    r = item.get("result")
                    if (r is None) or (r.get("label") in data_Isvalid):
                        continue
                    conf = float(r.get("conf", 0.0))
                    label = r.get("label")
                    cloud_url = item.get("cloud_url")

                    if conf >= 0.80:
                        status = "not valid"; censoreds.append(item)
                    elif 0.65 < conf < 0.80:
                        status = "awaiting censorship"; awaiting.append(item)
                    else:
                        status = "valid"; valids.append(item)

                    self.censorship_collection.insert_one({
                        "post_id": postid,
                        "label": label,
                        "confidence": conf,
                        "image_url": cloud_url,
                        "status": status,
                        "created_at": datetime.now()
                    })
            if censoreds:
                self.post_collection.update_one({"_id": ObjectId(postid)},
                                                {"$set": {"status": "not valid", "flag": True}})
                return {
                    "success": True,
                    "post_id": postid,
                    "media":{"message": " bài viết của bạn qua kiểm duyệt tự động thấy có vi phạm",
                    "status": "not valid",
                    },
                    "text_analysis": (text_result.get("data") if text_result else None)  # passthrough
                }
            elif awaiting and not censoreds:
                self.post_collection.update_one({"_id": ObjectId(postid)},
                                                {"$set": {"status": "awaiting", "flag": True}})
                return {
                    "success": True,
                    "post_id": postid,
                    "media":{"message": "bài viết của bạn qua kiểm duyệt tự động phát hiện có khả năng vi phạm. chúng tôi sẽ thông báo kết quả sớm nhất có thể",
                    "status": "awaiting",
                    },
                    "text_analysis": (text_result.get("data") if text_result else None)
                }
            else:
                self.post_collection.update_one({"_id": ObjectId(postid)},
                                                {"$set": {"status": "valid", "flag": False}})
                return {
                    "success": True,
                    "media":{
                        "mesage":"bài viết của bạn không phát hiện vi phạm"
                    },
                    "text_analysis": (text_result.get("data") if text_result else None)
                }

        except Exception as e:
            return {"success": False, "message": "Error in censorship", "error": str(e)}