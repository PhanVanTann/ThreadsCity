from fastapi import FastAPI
from app.routers.PredictImageRouter import router as predict_image_router

app = FastAPI()

app.include_router(predict_image_router, prefix="/ai")
#uvicorn app.main:app --reload --port 8001 