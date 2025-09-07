from ultralytics import YOLO
import cv2
import os
import requests
import numpy as np
import cloudinary.uploader
import tempfile


def predict_image(image_path, model, name_model, postid):
    results = model(image_path)
    best_detection = None
 

    for r in results:
        img_with_boxes = r.plot()
        for box in r.boxes:
            conf = float(box.conf[0])
            cls_id = int(box.cls[0])
            label = r.names[cls_id]
            print(label,'////////////')
            # Nếu đã có "violence" thì bỏ qua "NonViolence"
            if best_detection and best_detection["label"] == "Violence" and label == "NonViolence":
                continue

            # Nếu label hiện tại là "violence" và kết quả trước là "NonViolence" → thay luôn
            if best_detection and best_detection["label"] == "NonViolence" and label == "Violence":
                best_detection = None

            detection = {
                "name_model": name_model,
                "cls_id": cls_id,
                "label": label,
                "conf": conf
            }

            if best_detection is None or conf > best_detection["conf"]:
                best_detection = detection

    # Upload frame có box
    cloud_url = None
    if img_with_boxes is not None:
        temp_file = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
        cv2.imwrite(temp_file.name, img_with_boxes)
        upload_result = cloudinary.uploader.upload(temp_file.name)
        cloud_url = upload_result["secure_url"]

    return {
        "message": "Prediction successfully",
        "postid": postid,
        "result": best_detection, 
        "cloud_url": cloud_url
    }


def predict_video(video_path, model, name_model, postid):
    cap = cv2.VideoCapture(video_path)
    best_detection = None
    best_frame = None

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        results = model(frame)
        for r in results:
            frame_with_boxes = r.plot()
            for box in r.boxes:
                conf = float(box.conf[0])
                cls_id = int(box.cls[0])
                label = r.names[cls_id]

                if best_detection and best_detection["label"] == "violence" and label == "non_violence":
                    continue
                if best_detection and best_detection["label"] == "non_violence" and label == "violence":
                    best_detection = None

                detection = {
                    "name_model": name_model,
                    "cls_id": cls_id,
                    "label": label,
                    "conf": conf
                }

                if best_detection is None or conf > best_detection["conf"]:
                    best_detection = detection
                    best_frame = frame_with_boxes.copy()

    cap.release()

    cloud_url = None
    if best_frame is not None:
        temp_file = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
        cv2.imwrite(temp_file.name, best_frame)
        upload_result = cloudinary.uploader.upload(temp_file.name)
        cloud_url = upload_result["secure_url"]

    return {
        "message": "Prediction successfully",
        "postid": postid,
        "result": best_detection,
        "cloud_url": cloud_url
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
        return None 

