import os
from concurrent.futures import ThreadPoolExecutor
from ultralytics import YOLO
import cv2
from models.predict_img.ultis import predict_image, predict_video, download_file

models = {
    "weapon": YOLO("models/predict_img/yolo_weapon/runs/train3/weights/best.pt"),
    "violence": YOLO("models/predict_img/yolo_violence/runs/detect/train/weights/best.pt"),
    "blood": YOLO("models/predict_img/yolo_blood/runs/detect/train/weights/best.pt"),

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