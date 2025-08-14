from models.predict_img.main import predict 
from models.predict_text.predict import predict_text

def predict_image_service(postid: str, url: str):
    result = predict(url, postid)
    return {"message": "Predicted successfully", "result": result}

def predict_text_service(postid:str,text:str):
    result = predict_text(postid,text) 
    return {"message": "Predicted successfully", "result": result}