from utils.mogodbConnet import mongo
from utils.jwt import decode_token

class collection:
    def __init__(self):
        self.user_collection = mongo.get_collection('users')

    def get_user_collection(self):
        return self.user_collection

class emailService(collection):
    def __init__(self):
        super().__init__()
        self.user_collection = self.get_user_collection()

    def verify_email_token(self, email):
        try:
            user = self.user_collection.find_one({"email": email})
            if user and not user.get("is_verified", False):
                self.user_collection.update_one({"email": email}, {"$set": {"is_verified": True}})
                return {"status": True, "message": "Email verified successfully."}
            return {"status": False, "message": "Invalid or already verified email."}
        except Exception as e:
            print(f"Error verifying email: {e}")
            return {"status": False, "message": "Error verifying email."}


