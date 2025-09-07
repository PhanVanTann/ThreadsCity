from fastapi import APIRouter
router = APIRouter()
from pydantic import BaseModel
from app.services.PredictImageService import predict_image_service,predict_text_service

class PredictIMGRequest(BaseModel):
    postid: str
    url: str
class PredictTextRequest(BaseModel):
    postid:str
    text:str
@router.post("/predict_image")
async def predict_image(req : PredictIMGRequest):
    result = predict_image_service(req.postid,req.url)
    print(result)
    return result

@router.post("/predict_text")
async def predict_text(req:PredictTextRequest):
    result = predict_text_service(req.postid,req.text)
    return result