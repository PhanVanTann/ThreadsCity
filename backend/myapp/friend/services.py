from utils.mogodbConnet import mongo
from bson import ObjectId
from datetime import datetime

class collection:
    def __init__(self):
        self.friend_collectiton = mongo.get_collection('friend')
        self.user_collection = mongo.get_collection('users')
    def get_friend_collection(self):
        return self.friend_collectiton
    def get_user_collection(self): 
        return self.user_collection

class FriendService(collection):
    def __init__(self):
        super().__init__()
        self.friend_collection=self.get_friend_collection()
        self.user_collection = self.get_user_collection()
    
    def create_friend(self,follower_id,followee_id):
        try:
            if follower_id == followee_id:
                return {"success": False, "message": "Không thể follow chính mình"}

            exists = self.friend_collection.find_one({
                'follower_id': follower_id,
                'followee_id': followee_id
            })

            if exists:
                
                self.friend_collection.delete_one({
                    'follower_id': follower_id,
                    'followee_id': followee_id
                })
                return {"success": True, "message": "Đã unfollow", "is_friend": False}
            else:
                
                self.friend_collection.insert_one({
                    'follower_id': follower_id,
                    'followee_id': followee_id,
                    'created_at': datetime.now()
                })

            
                is_friend = self.friend_collection.find_one({
                    'follower_id': followee_id,
                    'followee_id': follower_id
                }) is not None

                return {
                    "success": True,
                    "message": "Follow thành công",
                    "is_friend": is_friend
                }
        except Exception as e:
            return{"success":False,"message":str(e)}
    def get_flowersbyuserid(self,user_id):
        try:
            user_data = self.user_collection.find_one({'_id':ObjectId(user_id)})
            if not user_data:
                return {"success":False,"message":"user khoong tồn tại"}
            flowers = self.friend_colleciton.find({"follower_id":user_id}) 
            flowers_list = list(flowers) 
            print("flowers",flowers)
            if not flowers_list:
                return {"success":True,"message":"bạn chưa có bạn bè nào","flowers":None}
            flowers_id = [item['followee_id'] for item in flowers_list ]
            print("flowers_id",flowers_id)
            
            flowers_infor = list(
                self.user_collection.find(
                    {"_id": {"$in": [ObjectId(fid) for fid in flowers_id]}},
                    {"first_name": 1,"last_name":1, "avatar": 1}
                )
            )
            flowers_data = []
            for u in flowers_infor:
                flowers_data.append({
                    "id":str(u['_id']),
                    "first_name":u['first_name'],
                    "last_name":u['last_name'],
                    "avatar":u['avatar']

                })
            
            return {"success":True,"flowers":flowers_data}
        except Exception as e:
            return{"success":False,"message":str(e)}
    
    def getlistfriend(self, user_id: str):
        """
        Danh sách bạn bè (mutual follow):
        - followees: những người user_id đang follow
        - followers: những người đang follow user_id
        - friends = giao (mutual) followees ∩ followers
        """
        try:
            # 1) Lấy những người mình đang follow
            followees_cursor = self.friend_collection.find(
                {'follower_id': user_id},
                {'_id': 0, 'followee_id': 1}
            )
            followees = {doc['followee_id'] for doc in followees_cursor}

            # 2) Lấy những người đang follow mình
            followers_cursor = self.friend_collection.find(
                {'followee_id': user_id},
                {'_id': 0, 'follower_id': 1}
            )
            followers = {doc['follower_id'] for doc in followers_cursor}

          
            mutual_ids = list(followees & followers)

            if not mutual_ids:
                return {"success": True, "data": "bạn chưa có bạn bè"}

          
            users_cursor = self.user_collection.find(
                {"_id": {"$in": [ObjectId(uid) for uid in mutual_ids]}},
                {"first_name": 1, "last_name": 1, "avatar": 1}
            )
            friends = [
                {
                    "id": str(u["_id"]),
                    "first_name": u.get("first_name"),
                    "last_name": u.get("last_name"),
                    "avatar": u.get("avatar")
                }
                for u in users_cursor
            ]

            return {"success": True, "data": friends}
        except Exception as e:
            return {"success": False, "message": str(e)}
