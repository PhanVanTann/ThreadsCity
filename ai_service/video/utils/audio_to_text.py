import whisper
import os
import moviepy as mp 

def extract_audio_from_video(video_path, audio_path):
    video = mp.VideoFileClip(video_path)
    video.audio.write_audiofile(audio_path)

def transcribe_audio(audio_path, model_size='base'):
    model = whisper.load_model(model_size)
    result = model.transcribe(audio_path)
    return result['text']

def convert_video_to_text(video_path, audio_output_path="temp_audio.wav", model_size='base'):
    print("🎥 Đang trích xuất âm thanh từ video...")
    extract_audio_from_video(video_path, audio_output_path)
    text = transcribe_audio(audio_output_path, model_size)
    print('text:', text)
    return text
