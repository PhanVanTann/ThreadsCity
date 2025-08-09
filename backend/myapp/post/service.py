import requests

class ImageCensorshipService():
    async def image_censorship(url,postid):
        try:
            result = await requests.post('http://127.0.0.1:8001/ai/predict_image', {
                "image_url": url,
                'postid': postid
                })
            return {"success": True, "message": "Image censorship completed successfully", "data": result}
        except Exception as e:
            return {
                "message": "Error in image censorship",
                "postid": postid,
                "error": str(e)
            }
