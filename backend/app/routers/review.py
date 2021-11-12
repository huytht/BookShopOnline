from fastapi import APIRouter, Body, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from ..models.review import ReviewModel, ReviewUpdateModel
import time

router = APIRouter()

async def getNextSequence(name: str, request: Request):
    ret = await request.app.mongodb["review"].find_one_and_update(
        filter={"_id": name},
        upsert=True, 
        update={"$inc": {"seq": 1}},
        return_document=True
    )

    return f"{ret['seq']}"

@router.get("/", response_description="List all review")
async def list_reviews(request: Request):
    reviews = []
    for review in await request.app.mongodb["review"].find().to_list(length=100):
        if isinstance(review["_id"], int):
            if (user := await request.app.mongodb["user"].find_one({"_id": review['user_id']})) is not None:
                review['user_username'] = user['username']
            if (book := await request.app.mongodb["book"].find_one({"_id": review['book_id']})) is not None:
                review['book_title'] = book['title'] 
            reviews.append(review)

    return reviews

@router.get("/get-review/{id}", response_description="Get review detail")
async def get_review(id: int, request: Request):
    if (review := await request.app.mongodb["review"].find_one({"_id": id})) is not None:
        return review
    
    raise HTTPException(status_code=404, detail="Review {id} not found")

@router.post("/create-review/")
async def create_review(request: Request, review: ReviewModel = Body(...)):
    review = jsonable_encoder(review)
    review['_id'] = int(await getNextSequence("reviewid", request))
    review['created_date'] = int(time.time())
    new_review = await request.app.mongodb["review"].insert_one(review)
    created_review = await request.app.mongodb["review"].find_one(
        {"_id": new_review.inserted_id}
    )

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_review)

@router.put("/update-review/{id}")
async def update_review(id: int, request: Request, review: ReviewUpdateModel = Body(...)):
    review = {k: v for k, v in review.dict().items() if v is not None}

    if (len(review) >= 1):
        update_review_result = await request.app.mongodb["review"].update_one(
            {"_id": id},
            {"$set": review}
        )

        if update_review_result.modified_count == 1:
            if (update_review := await request.app.mongodb["review"].find_one(
                {"_id": id}
            )) is not None:
                return update_review

    if (existing_review := await request.app.mongodb["review"].find_one(
            {"_id": id}
        )) is not None:
        return existing_review
    
    raise HTTPException(status_code=404, detail=f"review {id} not found")

@router.delete("/delete-review/{id}")
async def delete_review(id: int, request: Request):
    delete_review = await request.app.mongodb["review"].delete_one({"_id": id})

    if delete_review.deleted_count == 1:
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)

    raise HTTPException(status_code=404, detail=f"review {id} not found")
