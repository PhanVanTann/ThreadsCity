from ultralytics import YOLO
import cv2
import os
import requests
import numpy as np


def predict_image(image_path, model, name_model, postid):
    results = model(image_path)
    best_detection = None
    results[0].show()
    for r in results:
        for box in r.boxes:
            conf = float(box.conf[0])
            cls_id = int(box.cls[0])
            detection = {
                "name_model": name_model,
                "cls_id": cls_id,
                "label": r.names[cls_id],
                "conf": conf
            }
            if best_detection is None or conf > best_detection["conf"]:
                best_detection = detection

    return {
        "message": "Prediction successfully",
        "postid": postid,
        "result": best_detection
    }


def predict_video(video_path, model, name_model, postid):
    cap = cv2.VideoCapture(video_path)
    best_detection = None

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        results = model(frame)
        for r in results:
            for box in r.boxes:
                conf = float(box.conf[0])
                cls_id = int(box.cls[0])
                detection = {
                    "name_model": name_model,
                    "cls_id": cls_id,
                    "label": r.names[cls_id],
                    "conf": conf
                }
                if best_detection is None or conf > best_detection["conf"]:
                    best_detection = detection

    cap.release()
    return {
        "message": "Prediction successfully",
        "postid": postid,
        "result": best_detection
    }

def download_file(video_url, save_path):
    """
    Tải video từ URL và lưu vào đường dẫn chỉ định.
    """
    # Tạo thư mục nếu chưa có
    dir_path = os.path.dirname(save_path)
    print(f"Đang tạo thư mục: {dir_path} nếu chưa tồn tại...")
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)

    # Tải video
    response = requests.get(video_url, stream=True)
    print(f"Đang tải video từ {response}...")
    
    if response.status_code == 200:
        with open(save_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        print(f"✅ Video đã được tải về: {save_path}")
        return save_path
    else:
        print("❌ Không thể tải video, mã lỗi:", response.status_code)

