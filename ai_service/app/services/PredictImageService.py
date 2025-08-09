from models.predict_img.main import predict 

def predict_image_service(postid: str, url: str):
    result = predict(url, postid)
    return {"message": "Predicted successfully", "result": result}