from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Body, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from ..models.book import BookModel, BookUpdateModel
from ..routers.category import list_category
from ..routers.book_details import update_book_details
import re

router = APIRouter()

TIME_FORMAT = '%Y-%m-%dT%H:%M:%S'


async def getNextSequence(name: str, request: Request):
    ret = await request.app.mongodb["book"].find_one_and_update(
        filter={"_id": name},
        upsert=True,
        update={"$inc": {"seq": 1}},
        return_document=True
    )

    return f"{ret['seq']}"


@router.get("/", response_description="List all book")
async def list_books(request: Request):
    books = []

    for book in await request.app.mongodb["book"].find().to_list(length=100):
        category_name = []
        if isinstance(book["_id"], int):
            if (publisher := await request.app.mongodb["publisher"].find_one({"_id": book['publisher_id']})) is not None:
                book['publisher'] = publisher
            for category_id in book['category_id']:
                for cate in await list_category(request):
                    if cate['_id'] == category_id:
                        category_name.append(cate['name'])
                        break

            book['category'] = category_name
            books.append(book)

    return books

@router.get("/list-book-by-category/{id}", response_description="find list book by category")
async def find_list_book_by_category(id: int, request: Request):
    books = []
    if id == 1:
        for book in await request.app.mongodb["book"].find().to_list(length=500):
            if isinstance(book["_id"], int):
                book['rate'] = await get_rate_book(book['_id'], request)
                book['review'] = len(await get_review_book(book['_id'], request))
                books.append(book)
    if id == 16:
        for book in await request.app.mongodb["book"].find(sort=[('$natural', -1)]).to_list(length=500):
            if isinstance(book["_id"], int):
                book['rate'] = await get_rate_book(book['_id'], request)
                book['review'] = len(await get_review_book(book['_id'], request))
                books.append(book)
    else:
        for book in await request.app.mongodb["book"].find({'category_id': id}).to_list(length=100):
            book['rate'] = await get_rate_book(book['_id'], request)
            book['review'] = len(await get_review_book(book['_id'], request))
            books.append(book)

    return books

@router.get("/list-book-by-name/{keyword}", response_description="find list book by name")
async def find_list_book_by_name(keyword: str, request: Request):
    books = []
    for book in await request.app.mongodb["book"].find({"title": {"$in": [re.compile(f'{keyword.lower()}'), re.compile(f'{keyword.capitalize()}'), keyword]}}).to_list(length=100):
        book['rate'] = await get_rate_book(book['_id'], request)
        book['review'] = len(await get_review_book(book['_id'], request))
        books.append(book)

    return books

@router.get("/list-book-by-author/{keyword}", response_description="find list book by name")
async def find_list_book_by_author(keyword: str, request: Request):
    books = []
    for book in await request.app.mongodb["book"].find({"author": keyword}).to_list(length=100):
        book['rate'] = await get_rate_book(book['_id'], request)
        book['review'] = len(await get_review_book(book['_id'], request))
        books.append(book)

    return books

@router.get("/list-book-by-publisher/{id}", response_description="find list book by name")
async def find_list_book_by_publisher(id: int, request: Request):
    books = []
    for book in await request.app.mongodb["book"].find({"publisher_id": id}).to_list(length=100):
        book['rate'] = await get_rate_book(book['_id'], request)
        book['review'] = len(await get_review_book(book['_id'], request))
        books.append(book)

    return books


@router.get("/list-best-book", response_description="List best book")
async def list_best_books(request: Request):
    books = []

    for book in await request.app.mongodb["book"].find().to_list(length=9):
        if isinstance(book["_id"], int):
            book['rate'] = await get_rate_book(book['_id'], request)
            book['review'] = len(await get_review_book(book['_id'], request))
            books.append(book)

    return books

@router.get("/list-newest-book", response_description="List newest book")
async def list_newest_books(request: Request):
    books = []

    for book in await request.app.mongodb["book"].find(sort=[('$natural', -1)]).to_list(length=8):
        if isinstance(book["_id"], int):
            book['rate'] = await get_rate_book(book['_id'], request)
            book['review'] = len(await get_review_book(book['_id'], request))
            books.append(book)

    return books

@router.get("/get-book/{id}", response_description="Get book detail")
async def get_book(id: int, request: Request):
    if (book := await request.app.mongodb["book"].find_one({"_id": id})) is not None:
        category_name = []
        for category_id in book['category_id']:
            for cate in await request.app.mongodb["category"].find({"_id": category_id}).to_list(len(book['category_id'])):
                category_name.append(cate['name'])
        if (publisher := await request.app.mongodb["publisher"].find_one({"_id": book['publisher_id']})) is not None:
            book['publisher'] = publisher
        book['category'] = category_name
        book['related_book'] = await find_list_book_related(book['category_id'][0], request)
        book['quantity_active'] = await get_quantity_active_book(book['_id'], request)
        book['rate'] = await get_rate_book(book['_id'], request)
        book['review'] = await get_review_book(book['_id'], request)

        return JSONResponse(status_code=status.HTTP_200_OK, content=book)

    raise HTTPException(status_code=404, detail="Book {id} not found")

@router.get("/list-book-related/{id}", response_description="find list book by name")
async def find_list_book_related(id: int, request: Request):
    books = []
    for book in await request.app.mongodb["book"].find({"category_id": id}).to_list(length=8):
        book['rate'] = await get_rate_book(book['_id'], request)
        book['review'] = len(await get_review_book(book['_id'], request))
        books.append(book)

    return books

@router.get("/get-quantity-active-book/{id}", response_description="Get quantity active book")
async def get_quantity_active_book(id: int, request: Request):
    count: int = 0
    for book_details in await request.app.mongodb["book_details"].find({"book_id": id, "isSold": False}).to_list(50):
        count += 1
    
    return count


@router.get("/get-list-book-detail/{id}/{quantity}", response_description="Get list book from quantity")
async def get_list_book_for_order(id: int, quantity: int, request: Request):
    books = []
    count: int = 0
    if (book := await request.app.mongodb["book"].find_one({"_id": id})) is not None:
        for book_detail in await request.app.mongodb["book_details"].find({"book_id": id, "isSold": False}).to_list(quantity):
            book_detail['isSold'] = True
            await update_book_details(book_detail['_id'], request, book_detail)
            books.append(book_detail['_id'])

        return books

    raise HTTPException(status_code=404, detail=f"Book {id} not found")


@router.post("/create-book/")
async def create_book(request: Request, book: BookModel = Body(...)):
    book = jsonable_encoder(book)
    book['_id'] = int(await getNextSequence("bookid", request))
    new_book = await request.app.mongodb["book"].insert_one(book)
    created_book = await request.app.mongodb["book"].find_one(
        {"_id": new_book.inserted_id}
    )

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_book)

@router.put("/update-book/{id}")
async def update_book(id: int, request: Request, book: BookUpdateModel = Body(...)):
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
async def delete_book(id: int, request: Request):
    delete_book = await request.app.mongodb["book"].delete_one({"_id": id})

    if delete_book.deleted_count == 1:
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)

    raise HTTPException(status_code=404, detail=f"book {id} not found")


@router.get("/get-rate-book/{id}")
async def get_rate_book(id: int, request: Request):
    total_rate: int = 0
    sum_rate: int = 0
    for review in await request.app.mongodb["review"].find({"book_id": id}).to_list(1000):
        total_rate += 1
        sum_rate += review['rate']
    if total_rate == 0:
        return 0
    return int(sum_rate/total_rate)


@router.get("/get-review-book/{id}")
async def get_review_book(id: int, request: Request):
    reviews = []
    for review in await request.app.mongodb["review"].find({"book_id": id}).to_list(1000):
        if (user := await request.app.mongodb["user"].find_one({"_id": review['user_id']})) is not None:
            review['user'] = user
        reviews.append(review)

    return reviews


@router.get('/check-book/{title}')
async def check_books(title: str, request: Request):
    for book in await list_books(request):
        if book['title'] == title:
            return True

    return False


@router.get('/check-book/{title}/{id}')
async def check_books(title: str, id: int, request: Request):
    for book in await list_books(request):
        if book['title'] == title and book['_id'] != id:
            return True

    return False
