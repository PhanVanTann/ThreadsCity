import requests

class ImageCensorshipService:
    def image_censorship(self,url,postid):
        print("Image Censorship Service called with URL:", url, "and post ID:", postid)
        try:
            result = requests.post('http://127.0.0.1:8001/ai/predict_image', json={
                "url": url,
                'postid': postid
                })
            print("Image Censorship Result:", result.json())
            return {"success": True, "message": "Image censorship completed successfully", "data": result.json()}
        except Exception as e:
            return {
                "message": "Error in image censorship",
                "postid": postid,
                "error": str(e)
            }
 