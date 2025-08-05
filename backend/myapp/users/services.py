from utils.mogodbConnet import mongo
import bcrypt
from django.http import JsonResponse 
from utils.sendemail import send_verify_email
from utils.jwt import create_email_token
from datetime import datetime

class collectionUser:
    def __init__(self):
        self.collection_users = mongo.get_collection('users')

    def get_collection_user(self):
        return self.collection_users

class UserService(collectionUser):
    def __init__(self):
        super().__init__()
        self.user_collection = self.get_collection_user()

    ## Check if user exists
    def check_user_exists(self, email):
        user = self.user_collection.find_one({"email": email})
        if user:
            return {"success": True, "message": "User already exists."}
        return {"success": False, "message": "User does not exist."}
    
    
    ## Create user
    def create_user(self, user_data):
        try:
            request_data = { 
                "email": user_data.get("email"),
                "password": user_data.get("password"),
                "first_name": user_data.get("first_name"),
                "last_name": user_data.get("last_name"),
                "role": "user",
                "is_verified": False,
                "is_google_account": False,
                "created_at": datetime.now(),
            }
            if self.check_user_exists(request_data['email'])['success']==True:
                return {"success":False,"error": "User already exists."}
            if request_data["password"]:
                hashed_password = bcrypt.hashpw(request_data["password"].encode('utf-8'), bcrypt.gensalt())
                request_data['password'] = hashed_password.decode('utf-8')
             # Create email verification token
            token_email = create_email_token(request_data['email'])
            if not token_email:
                return {"success": False, "error": "Failed to create email token."}
            send_email = send_verify_email(request_data['email'],token_email)
            if not send_email:              
                return {"success": False, "error": "Failed to send verification email."}
            result = self.user_collection.insert_one(request_data)
            if not result.acknowledged:
                return {"success": False, "error": "Failed to create user."}
            return {
                "success":True,
                "message": "User created successfully", 
                "user_id": str(result.inserted_id)
                }
        except Exception as e:
            print(f"Error creating user: {e}")
            return None

userService = UserService()