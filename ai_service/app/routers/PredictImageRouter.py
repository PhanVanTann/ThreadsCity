from fastapi import APIRouter
router = APIRouter()
from pydantic import BaseModel
from app.services.PredictImageService import predict_image_service

class PredictRequest(BaseModel):
    postid: str
    url: str

@router.post("/predict_image")
async def predict_image(req : PredictRequest):
    result = predict_image_service(req.postid,req.url)
    print(result)
    return result