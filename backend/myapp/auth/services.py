from utils.mogodbConnet import mongo
import bcrypt
from datetime import datetime
from django.http import JsonResponse
from utils.jwt import (
    create_access_token,
    create_refresh_token,
    decode_token,
    decode_token_notime,
    )
class collection:
    def __init__(self):
        self.user_collection = mongo.get_collection('users')
        self.session_collection = mongo.get_collection('sessions')
    def get_user_collection(self):
        return self.user_collection
    def get_session_collection(self):
        return self.session_collection

class emailService(collection):
    def __init__(self):
        super().__init__()
        self.user_collection = self.get_user_collection()

    def verify_email_token(self, email):
        try:
            user = self.user_collection.find_one({"email": email})
            if user and not user.get("is_verified", False):
                self.user_collection.update_one({"email": email}, {"$set": {"is_verified": True}})
                return {"success": True, "message": "Email verified successfully."}
            return {"success": False, "message": "Invalid or already verified email."}
        except Exception as e:
            print(f"Error verifying email: {e}")
            return {"success": False, "message": "Error verifying email."}

class LoginService(collection):
    def __init__(self):
        super().__init__()
        self.user_collection = self.get_user_collection()
        self.session_collection = self.get_session_collection()

    def create_session(self,user_id,email,role):
        access_token = create_access_token(str(user_id),role)
        refresh_token = create_refresh_token(str(user_id),role)
        # Kiểm tra xem đã có session cho user chưa
        existing_session = self.session_collection.find_one({"user_id": str(user_id)})
        if existing_session:
            self.session_collection.update_one(
                {"user_id": str(user_id)},
                {
                    "$set": {
                        "Access_Token": access_token,
                        "Refresh_Token": refresh_token,
                        "Created_at": datetime.now()
                    }
                }
            )
        else:
            dataSession = {
                "user_id": str(user_id),
                "Access_Token": access_token,
                "Refresh_Token": refresh_token,
                "Created_at": datetime.now()
            } 
            self.user_collection.update_one(
                            {'email': email},
                            {'$set': {'is_active': True}}  
                        )
            self.session_collection.insert_one(dataSession)
        return {
            "Access_Token": access_token,
            "Refresh_Token": refresh_token
        } 

    def login(self, email, password):
        try:
            user = self.user_collection.find_one({"email": email})
            if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
                if not user.get("is_verified", False):
                    return {"success": False, "message": "Email not verified."}
                dataSession = self.create_session(user['_id'],email,user['role'])
                return {
                            "success": True,
                            "message": "login success",
                            "access_token": dataSession['Access_Token'],
                            "refresh_token":dataSession['Refresh_Token'],
                            "user_id": str(user['_id'])
                        } 
            return {"success": False, "message": "Invalid email or password."}
        except Exception as e:
            print(f"Error during login: {e}")
            return {"success": False, "message": "Error during login."}

