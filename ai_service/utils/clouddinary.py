import os
from dotenv import load_dotenv
import cloudinary

load_dotenv('.env') 

cloud_name = os.getenv("CLOUD_NAME")
api_key = os.getenv("API_KEY")
api_secret = os.getenv("API_SECRET")
print(cloud_name, api_key, api_secret)

# Config Cloudinary
cloudinary.config(
    cloud_name = cloud_name,
    api_key = api_key,
    api_secret = api_secret,
    secure = True
)

print("Cloudinary đã config với cloud_name:", cloud_name)