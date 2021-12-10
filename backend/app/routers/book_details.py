from datetime import datetime
from fastapi import APIRouter, Body, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from ..models.book_details import BookDetailsModel, BookDetailsUpdateModel
from ..routers.category import list_category

router = APIRouter()

TIME_FORMAT = '%Y-%m-%dT%H:%M:%S'

async def getNextSequence(name: str, request: Request):
    ret = await request.app.mongodb["book_details"].find_one_and_update(
        filter={"_id": name},
        upsert=True,
        update={"$inc": {"seq": 1}},
        return_document=True
    )

    return f"{ret['seq']}"


@router.get("/", response_description="List all book details")
async def list_book_details(request: Request):
    book_details = []

    for book_detail in await request.app.mongodb["book_details"].find().to_list(length=100):
        if isinstance(book_detail["_id"], int):
            if (book := await request.app.mongodb["book"].find_one({"_id": book_detail['book_id']})) is not None:
                book_detail['book'] = book
                book_details.append(book_detail)

    return book_details


@router.get("/get-book-detail/{id}", response_description="Get book_details detail")
async def get_book_details(id: int, request: Request):
    if (book_details := await request.app.mongodb["book_details"].find_one({"_id": id})) is not None:
        return book_details

    raise HTTPException(status_code=404, detail="Book {id} not found")


@router.post("/create-book-detail/")
async def create_book_details(request: Request, book_details: BookDetailsModel = Body(...)):
    book_details = jsonable_encoder(book_details)
    book_details['published_date'] = datetime.strptime(book_details['published_date'], TIME_FORMAT + "+00:00").timestamp()
    book_details['_id'] = int(await getNextSequence("bookdetailsid", request))
    new_book_details = await request.app.mongodb["book_details"].insert_one(book_details)
    created_book_details = await request.app.mongodb["book_details"].find_one(
        {"_id": new_book_details.inserted_id}
    )

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_book_details)


@router.put("/update-book-detail/{id}")
async def update_book_details(id: int, request: Request, book_details: BookDetailsUpdateModel = Body(...)):
    if isinstance(book_details, dict) == False:
        book_details = {k: v for k, v in book_details.dict().items() if v is not None}

    if (len(book_details) >= 1):
        if isinstance(book_details['published_date'], datetime) == True:
            book_details['published_date'] = book_details['published_date'].timestamp()
        update_book_details_result = await request.app.mongodb["book_details"].update_one(
            {"_id": id},
            {"$set": book_details}
        )

        if update_book_details_result.modified_count == 1:
            if (update_book_details := await request.app.mongodb["book_details"].find_one(
                {"_id": id}
            )) is not None:
                return update_book_details

    if (existing_book_details := await request.app.mongodb["book_details"].find_one(
        {"_id": id}
    )) is not None:
        return existing_book_details

    raise HTTPException(status_code=404, detail=f"book_details {id} not found")


@router.delete("/delete-book-detail/{id}")
async def delete_book_details(id: int, request: Request):
    delete_book_details = await request.app.mongodb["book_details"].delete_one({"_id": id})

    if delete_book_details.deleted_count == 1:
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)

    raise HTTPException(status_code=404, detail=f"book_details {id} not found")


@router.get('/check-book-detail/{book_id}/{isbn}')
async def check_book_details(book_id: int, isbn: str, request: Request):
    for book_details in await list_book_details(request):
        if book_details['isbn'] == isbn and book_details['book_id'] == book_id:
            return True

    return False


@router.get('/check-book-detail/{book_id}/{isbn}/{id}')
async def check_book_details(book_id: int, isbn: str, id: int, request: Request):
    for book_details in await list_book_details(request):
        if book_details['isbn'] == isbn and book_details['_id'] != id and book_details['book_id'] == book_id:
            return True

    return False
