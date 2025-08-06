from utils.mogodbConnet import mongo
from bson import ObjectId
import bcrypt
from datetime import datetime
import requests
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
 
    

    def login(self, email, password):
        try:
            user = self.user_collection.find_one({"email": email})
            if user.get("is_google_account", True):
                return {"success": False, "message": "Please login with Google account."}
            if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
                if not user.get("is_verified", False):
                    return {"success": False, "message": "Email not verified."}
                dataSession = self.create_session(user['_id'],email,user['role'])
                return {
                            "success": True,
                            "message": "login success",
                            "access_token": dataSession['Access_Token'],
                            "refresh_token":dataSession['Refresh_Token'],
                            "user_id": str(user['_id']),
                            "role": user['role']
                        } 
            return {"success": False, "message": "Invalid email or password."}
        except Exception as e:
            print(f"Error during login: {e}")
            return {"success": False, "message": "Error during login."}

class UserLogoutService(collection):
    def __init__(self):
        self.session_collection = mongo.get_collection('sessions')
        self.user_collection = mongo.get_collection('users')

    def logout(self, user_id):
        try:          
            result = self.session_collection.delete_one({"user_id": str(user_id)})
            if result.deleted_count > 0:
                const = self.user_collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"is_active": False}}
                ) 
                print(const)
                return {"success": True, "message": "Logout successful."}
            
            return {"success": False, "message": "No active session found."}
        except Exception as e:
            print(f"Error during logout: {e}")
            return {"success": False, "message": "Error during logout."} 
class GoogoleService(collection):
    def __init__(self):
        super().__init__()
        self.user_collection = self.get_user_collection()

    def create_user(self, access_token):
        try:
            user_info = requests.get("https://www.googleapis.com/oauth2/v2/userinfo", headers={
                "Authorization": f"Bearer {access_token}"
            })
            if user_info.status_code != 200:
                return {"success": False, "message": "Failed to fetch user info from Google."}
            user_info = user_info.json()
            email = user_info.get("email")
            user_data = self.user_collection.find_one({"email": email})
            if user_data:
                if not user_data.get("is_verified", False):
                    return {"success": False, "message": "Email not verified."}
                dataSession = self.create_session(user_data['_id'], email, user_data['role'])
                if not user_data.get("is_google_account"):
                    self.user_collection.update_one(
                        {"email": email},
                        {"$set": {"is_google_account": True}}
                    )
                return {
                        "success": True,
                        "message": "Login successful.",
                        "access_token": dataSession['Access_Token'],
                        "refresh_token": dataSession['Refresh_Token'],
                        "user_id": str(user_data['_id']),
                        "role": user_data['role']
                    }
            else:
                request_data = { 
                    "email": email,
                    "first_name": user_info.get("family_name"),
                    "last_name": user_info.get("given_name"),
                    "role": "user",
                    "avatar": user_info.get("picture"),
                    "is_verified": True,
                    "is_google_account": True,
                    "is_google_account": True,
                    "created_at": datetime.now(),
                }
                respone = self.user_collection.insert_one(request_data)
                if not respone.acknowledged:
                    return {"success": False, "message": "Failed to create user."}
                dataSession = self.create_session(respone.inserted_id, email, "user")

            return {
                "success": True,
                "message": "User created successfully.",
                "access_token": dataSession['Access_Token'],
                "refresh_token": dataSession['Refresh_Token'],
                "user_id": str(respone.inserted_id),
                "role": "user"
            }
        except Exception as e:
            print(f"Error creating user: {e}")
            return {"success": False, "message": "Error creating user."}