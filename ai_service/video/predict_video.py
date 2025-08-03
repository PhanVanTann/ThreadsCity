from utils.extract_frames import extract_frames, download_video
from utils.audio_to_text import convert_video_to_text
import os

postid = "1234567890"
video_url = 'https://res.cloudinary.com/debzpay3s/video/upload/v1754064456/6864606285919_w8enhz.mp4' 
download_dir = "datas/videos"
video_filename = f"{postid}.mp4"
video_path = os.path.join(download_dir, video_filename)
output_dir = "frames"

# Tải video về
path_video = download_video(video_url, video_path)

# Cắt frame
frames = extract_frames(video_path, output_dir, postid, fps_interval=1)
print("✅ Đã cắt", len(frames), "frame")

text = convert_video_to_text(path_video)
print("🎙️ Transcript:\n", text)