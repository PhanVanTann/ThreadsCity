from ultralytics import YOLO
model = YOLO('yolov8n.yaml')
model.train(
    data = "datasets/data.yaml",
    epochs = 50,
    imgsz= 640,
    batch = 32,
    name='bad-detection',
    project='runs/train',
    exist_ok=True
)