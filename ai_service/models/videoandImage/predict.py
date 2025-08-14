from ultralytics import YOLO
import os
from utils.download_file import download_file
postid = "123456789"  # Giả sử bạn có postid từ đâu đó
url = 'https://res.cloudinary.com/debzpay3s/video/upload/v1754059934/sample_video_ye7joe.mp4'
model = YOLO('runs/train/bad-detection/weights/best.pt')  
ext = os.path.splitext(url)[1].lower()
print(ext)
if ext in ['.jpg', '.jpeg', '.png', '.bmp', '.webp']:
    print("Đây là ảnh")
    download_dir ="inputs/imgs"
    img_filename = f"{postid}{ext}"
    path= os.path.join(download_dir, img_filename)
    path_img = download_file(url, path)
    results = model(path_img) 
    results[0].show()  
elif ext in ['.mp4', '.avi', '.mov', '.mkv']:
    print("Đây là video")
    download_dir ="inputs/videos"
    video_filename = f"{postid}{ext}"
    path= os.path.join(download_dir, video_filename)
    path_video = download_file(url, path)
    results = model.predict(
    source=path_video,  # Ví dụ: '/content/drive/MyDrive/project_AI/test_video.mp4'
    conf=0.25,      # Confidence threshold (nếu cần chỉnh)
    save_txt=False, # Không cần xuất ra file .txt label (có thể True nếu bạn muốn)
    show=True, 
    stream = True # Hiển thị video trong thời gian thực
)
    for i, r in enumerate(results):
        print(f"Frame {i}: Found {len(r.boxes)} objects")
else:
    print("Không xác định được loại file")
# Hiển thị kết quả
 