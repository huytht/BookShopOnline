from fastapi import APIRouter, Body, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from ..models.order_details import OrderDetailsModel, OrderDetailsUpdateModel
from ..routers.book import get_book
from ..routers.book_details import get_book_details

router = APIRouter()


async def getNextSequence(name: str, request: Request):
    ret = await request.app.mongodb["order_details"].find_one_and_update(
        filter={"_id": name},
        upsert=True,
        update={"$inc": {"seq": 1}},
        return_document=True
    )

    return f"{ret['seq']}"


@router.get("/", response_description="List all order_details")
async def list_order_details(request: Request):
    order_details = []
    for order_detail in await request.app.mongodb["order_details"].find().to_list(length=1000):
        if isinstance(order_detail["_id"], int):
            book_detail = await get_book_details(order_detail['book_detail_id'], request)
            order_detail['book_detail'] = book_detail
            if (book := await request.app.mongodb["book"].find_one({"_id": book_detail['book_id']})) is not None:
                order_detail['book'] = book

            order_details.append(order_detail)

    return order_details


@router.get("/get-order-detail/{id}", response_description="Get order details")
async def get_order_detail(id: int, request: Request):
    if (order_detail := await request.app.mongodb["order_details"].find_one({"_id": id})) is not None:
        return order_detail

    raise HTTPException(status_code=404, detail="OrderDetails {id} not found")


@router.post("/create-order-detail/")
async def create_order_detail(request: Request, order_detail: OrderDetailsModel = Body(...)):
    order_detail = jsonable_encoder(order_detail)
    order_detail['_id'] = int(await getNextSequence("orderdetailsid", request))
    await request.app.mongodb["book_details"].update_one(
        {"_id": order_detail['book_detail_id']},
        {"$set": {"isSold": True}}
    )
    new_order_detail = await request.app.mongodb["order_details"].insert_one(order_detail)
    created_order_detail = await request.app.mongodb["order_details"].find_one(
        {"_id": new_order_detail.inserted_id}
    )

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_order_detail)


@router.put("/update-order-detail/{id}")
async def update_order_detail(id: int, request: Request, order_detail: OrderDetailsUpdateModel = Body(...)):
    order_detail = {k: v for k, v in order_detail.dict().items()
                    if v is not None}

    if (len(order_detail) >= 1):
        update_order_detail_result = await request.app.mongodb["order_details"].update_one(
            {"_id": id},
            {"$set": order_detail}
        )

        if update_order_detail_result.modified_count == 1:
            if (update_order_detail := await request.app.mongodb["order_details"].find_one(
                {"_id": id}
            )) is not None:
                return update_order_detail

    if (existing_order_detail := await request.app.mongodb["order_details"].find_one(
        {"_id": id}
    )) is not None:
        return existing_order_detail

    raise HTTPException(status_code=404, detail=f"order_detail {id} not found")


@router.delete("/delete-order-detail/{id}")
async def delete_order_detail(id: int, request: Request):
    delete_order_detail = await request.app.mongodb["order_details"].delete_one({"_id": id})

    if delete_order_detail.deleted_count == 1:
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)

    raise HTTPException(
        status_code=404, detail=f"order_details {id} not found")
