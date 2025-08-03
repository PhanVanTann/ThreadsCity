import cv2
import os
import requests
import numpy as np

def download_video(video_url, save_path):
    """
    Tải video từ URL và lưu vào đường dẫn chỉ định.
    """
    # Tạo thư mục nếu chưa có
    dir_path = os.path.dirname(save_path)
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

def extract_frames(video_path, output_dir,postid, fps_interval=1):
    """
    Cắt các frame từ video theo khoảng cách thời gian (fps_interval).
    
    Params:
        video_path (str): Đường dẫn tới video gốc.
        output_dir (str): Thư mục lưu ảnh đã cắt.
        fps_interval (int): Cắt mỗi giây 1 frame (mặc định).
    Returns:
        List[str]: Danh sách đường dẫn đến các frame đã cắt.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    print(f"FPS của video: {fps}")
    count = 0
    saved_frames = []

    while True:
        # Đọc từng frame từ video
        ret, frame = cap.read()
        if not ret:
            break
        # Kiểm tra thời gian hiện tại của frame
        # Nếu thời gian hiện tại chia hết cho fps_interval, lưu frame
        current_sec = count / fps
        if int(current_sec) % fps_interval == 0:
            frame_name = f"{output_dir}/frame{postid}_{current_sec}.jpg"
            # Lưu frame vào thư mục đã chỉ định 
            cv2.imwrite(frame_name, frame)
            saved_frames.append(frame_name)

        count += 1

    cap.release()
    return saved_frames
