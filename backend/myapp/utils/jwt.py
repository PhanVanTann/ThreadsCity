import jwt
from jwt.exceptions import (
    InvalidSignatureError,
    ExpiredSignatureError,
    DecodeError,
    InvalidTokenError
)
from datetime import datetime, timedelta
from django.conf import settings

def create_email_token(email):
    try:
        payload = {
            "email": email,
            "exp": datetime.utcnow() + timedelta(minutes=30),
            "purpose": "email_verification"
        }
        return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    except Exception as e:
        print(f"Error creating JWT token: {e}")
        return None
    
def decode_token(token: str):
    try:
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return decoded

    except ExpiredSignatureError:
        return {"error": "expired"}

    except InvalidSignatureError:
        return {"error": "invalid_signature"}

    except DecodeError:
        return {"error": "decode_error"}

    except InvalidTokenError:
        return {"error": "invalid_token"}

    except Exception as e:
        return {"error": "unknown_error"}