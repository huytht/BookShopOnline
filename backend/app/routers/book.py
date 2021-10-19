from datetime import datetime
import json
from fastapi import APIRouter, Body, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from ..models.book import BookModel, BookUpdateModel

router = APIRouter()

def defaultconverter(o):
  if isinstance(o, datetime):
      return o.__str__()

@router.get("/", response_description="List all book")
async def list_books(request: Request):
    books = []
    categories = []
    
    for cate in await request.app.mongodb["category"].find().to_list(length=100):
        categories.append(cate)

    for book in await request.app.mongodb["book"].find().to_list(length=100):
        category_name = []
        for category_id in book['category_id']:
            for cate in categories:
                if cate['_id'] == category_id:
                    category_name.append(cate['name'])
                    break
        book['category_id'] = category_name
        book['published_date'] = book['published_date'].strftime("%d/%m/%Y")
        books.append(book)

    return books

@router.get("/get-book/{id}", response_description="Get book detail")
async def get_book(id: str, request: Request):
    if (book := await request.app.mongodb["book"].find_one({"_id": id})) is not None:
        return book
    
    raise HTTPException(status_code=404, detail="Book {id} not found")

@router.post("/create-book/")
async def create_book(request: Request, book: BookModel = Body(...)):
    book = jsonable_encoder(book)
    # book['published_date'] = datetime.strptime(book['published_date'], "%Y-%m-%d %H:%M:%S")
    # book = json.dumps(book, default = defaultconverter)
    new_book = await request.app.mongodb["book"].insert_one(book)
    created_book = await request.app.mongodb["book"].find_one(
        {"_id": new_book.inserted_id}
    )

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_book)

@router.put("/update-book/{id}")
async def update_book(id: str, request: Request, book: BookUpdateModel = Body(...)):
    book = {k: v for k, v in book.dict().items() if v is not None}

    if (len(book) >= 1):
        update_book_result = await request.app.mongodb["book"].update_one(
            {"_id": id},
            {"$set": book}
        )

        if update_book_result.modified_count == 1:
            if (update_book := await request.app.mongodb["book"].find_one(
                {"_id": id}
            )) is not None:
                return update_book

    if (existing_book := await request.app.mongodb["book"].find_one(
            {"_id": id}
        )) is not None:
        return existing_book
    
    raise HTTPException(status_code=404, detail=f"book {id} not found")

@router.delete("/delete-book/{id}")
async def delete_book(id: str, request: Request):
    delete_book = await request.app.mongodb["book"].delete_one({"_id": id})

    if delete_book.deleted_count == 1:
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)

    raise HTTPException(status_code=404, detail=f"book {id} not found")