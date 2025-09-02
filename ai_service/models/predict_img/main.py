import os
from concurrent.futures import ThreadPoolExecutor
from ultralytics import YOLO
import cv2
from models.predict_img.ultis import predict_image, predict_video, download_file
from dotenv import load_dotenv
import cloudinary

load_dotenv() 

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

models = {
    "weapon": YOLO("models/predict_img/yolo_weapon/runs/train/weights/best.pt"),
    "violence": YOLO("models/predict_img/yolo_violence/runs1/train/weights/best.pt"),
    "smoke": YOLO("models/predict_img/yolo_smoking/runs/train/weights/best.pt"),

}


def predict(url: str, postid: str):
    ext = os.path.splitext(url)[1].lower()
    download_dir = "inputs/datas"
    img_filename = f"{postid}{ext}"
    path = os.path.join(download_dir, img_filename)
    download_file(url,path)
    
    results_all = []
    with ThreadPoolExecutor(max_workers=len(models)) as executor:
        futures = []
        if ext in ['.jpg', '.jpeg', '.png', '.bmp', '.webp']:
            for name, model in models.items():
                futures.append(executor.submit(predict_image, path, model, name, postid))
        elif ext in ['.mp4', '.avi', '.mov']:
            for name, model in models.items():
                futures.append(executor.submit(predict_video, path, model, name, postid))
        else:
            return {"message": "Unsupported file type", "results": []}

        for future in futures:
            results_all.append(future.result())
        return results_all