import os
import requests
import numpy as np

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

