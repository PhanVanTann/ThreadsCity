from ultralytics import YOLO
import os
from utils.download_file import download_file
from concurrent.futures import ThreadPoolExecutor
import cv2

models = {
    "weapon": YOLO("models/predict_img/yolo_weapon/runs/train3/weights/best.pt"),
    "violence": YOLO("models/predict_img/yolo_violence/runs/detect/train/weights/best.pt"),
    "blood": YOLO("models/predict_img/yolo_blood/runs/detect/train/weights/best.pt"),
}

def run_model(model, frame):
    return model.predict(frame, verbose=False, show=True)


def merge_predictions(results_by_model):
    merged = []
    seen = defaultdict(lambda: {"conf": 0})

    for result in results_by_model:
        for label, conf, box in zip(result["labels"], result["confidence"], result["boxes"]):
            key = (label, tuple(box))
            if conf > seen[key]["conf"]:
                seen[key] = {
                    "label": label,
                    "conf": conf,
                    "box": box,
                    "model": result["model"]
                }

    for data in seen.values():
        merged.append({
            "label": data["label"],
            "confidence": data["conf"],
            "box": data["box"],
            "model": data["model"]
        })
    return merged

def predict_image(url: str, postid: str):
    ext = os.path.splitext(url)[1].lower()
    detected = False

    if ext in ['.jpg', '.jpeg', '.png', '.bmp', '.webp']:
        print("\u0110\u00e2y l\u00e0 \u1ea3nh")
        download_dir = "inputs/imgs"
        img_filename = f"{postid}{ext}"
        path = os.path.join(download_dir, img_filename)
        path_img = download_file(url, path)

        all_results = []

        for name, model in models.items():
            results = model(path_img)
            for r in results:
                if r.boxes is not None and len(r.boxes) > 0:
                    all_results.append({
                        "model": name,
                        "boxes": r.boxes.xyxy.tolist(),
                        "labels": [r.names[int(cls)] for cls in r.boxes.cls],
                        "confidence": r.boxes.conf.tolist(),
                    })
                    detected = True

        if not detected:
            return {
                "message": "No objects detected",
                "result": []
            }

        return {
            "message": "Predicted successfully",
            "result": merge_predictions(all_results)
        }

    elif ext in ['.mp4', '.avi', '.mov', '.mkv']:
        print("\u0110\u00e2y l\u00e0 video")
        download_dir = "inputs/videos"
        video_filename = f"{postid}{ext}"
        path = os.path.join(download_dir, video_filename)
        path_video = download_file(url, path)

        video_results = []

        for name, model in models.items():
            results = model.predict(
                source=path_video,
                conf=0.25,
                save_txt=False,
                show=False,
                stream=True
            )
            for i, r in enumerate(results):
                if r.boxes is not None and len(r.boxes) > 0:
                    video_results.append({
                        "model": name,
                        "frame": i,
                        "boxes": r.boxes.xyxy.tolist(),
                        "labels": [r.names[int(cls)] for cls in r.boxes.cls],
                        "confidence": r.boxes.conf.tolist(),
                    })
                    detected = True

        if not detected:
            return {
                "message": "No objects detected",
                "result": []
            }

        return {
            "message": "Predicted successfully",
            "result": video_results
        }

    else:
        return {"message": "Unsupported file type", "result": None}