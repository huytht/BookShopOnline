from typing import Optional
from fastapi import APIRouter, Body, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from ..models.order import OrderModel, OrderUpdateModel
from .order_details import delete_order_detail
import time
from datetime import datetime

router = APIRouter()

TIME_FORMAT = '%Y-%m-%dT%H:%M:%S'


async def getNextSequence(name: str, request: Request):
    ret = await request.app.mongodb["order"].find_one_and_update(
        filter={"_id": name},
        upsert=True,
        update={"$inc": {"seq": 1}},
        return_document=True
    )

    return f"{ret['seq']}"


@router.get("/", response_description="List all order")
async def list_orders(request: Request):
    orders = []
    for order in await request.app.mongodb["order"].find().to_list(length=100):
        if isinstance(order["_id"], int):
            if (user := await request.app.mongodb["user"].find_one({"_id": order['user_id']})) is not None:
                order['user_id'] = user
            if (payment := await request.app.mongodb["payment"].find_one({"_id": order['payment_id']})) is not None:
                order['payment_id'] = payment
            orders.append(order)

    return orders


@router.get("/list-order-user/{id}", response_description="List order of user")
async def list_order_for_user(id: int, request: Request):
    orders = []
    for order in await request.app.mongodb["order"].find({"user_id": id}).to_list(length=100):
        if (payment := await request.app.mongodb["payment"].find_one({"_id": order['payment_id']})) is not None:
            order['payment_id'] = payment
        if (address := await request.app.mongodb["address"].find_one({"_id": order['shipping_address_id']})) is not None:
            order['shipping_address_id'] = address
        orders.append(order)

    return orders


@router.get("/find-by-order-number/{id}/{order_number}", response_description="Find list order for user")
async def find_by_order_number(id: int, order_number: str, request: Request):
    orders = []
    for order in await request.app.mongodb["order"].find({"user_id": id, "order_tracking_number": order_number}).to_list(length=100):
        if (payment := await request.app.mongodb["payment"].find_one({"_id": order['payment_id']})) is not None:
            order['payment_id'] = payment
        if (address := await request.app.mongodb["address"].find_one({"_id": order['shipping_address_id']})) is not None:
            order['shipping_address_id'] = address
        orders.append(order)
        break
        
    return orders

@ router.get("/get-order/{id}", response_description="Get order detail")
async def get_order(id: int, request: Request):
    if (order := await request.app.mongodb["order"].find_one({"_id": id})) is not None:
        return order

    raise HTTPException(status_code=404, detail="Order {id} not found")

@ router.post("/create-order/")
async def create_order(request: Request, order: OrderModel = Body(...)):
    order = jsonable_encoder(order)
    order['created_date'] = datetime.strptime(order['created_date'], TIME_FORMAT + "+00:00").timestamp()
    order['_id'] = int(await getNextSequence("orderid", request))
    new_order = await request.app.mongodb["order"].insert_one(order)
    created_order = await request.app.mongodb["order"].find_one(
        {"_id": new_order.inserted_id}
    )

    return JSONResponse(status_code = status.HTTP_201_CREATED, content = created_order)

@ router.put("/update-order/{id}")
async def update_order(id: int, request: Request, order: OrderUpdateModel = Body(...)):
    order={k: v for k, v in order.dict().items() if v is not None}

    if (len(order) >= 1):
        update_order_result=await request.app.mongodb["order"].update_one(
            {"_id": id},
            {"$set": order}
        )

        if update_order_result.modified_count == 1:
            if (update_order := await request.app.mongodb["order"].find_one(
                {"_id": id}
            )) is not None:
                return update_order

    if (existing_order := await request.app.mongodb["order"].find_one(
            {"_id": id}
        )) is not None:
        return existing_order
    
    raise HTTPException(status_code=404, detail=f"order {id} not found")

@router.delete("/delete-order/{id}")
async def delete_order(id: int, request: Request):
    delete_order = await request.app.mongodb["order"].delete_one({"_id": id})

    if delete_order.deleted_count == 1:
        for order_detail in await get_order_details(id, request):
            await delete_order_detail(order_detail['_id'], request)
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)

    raise HTTPException(status_code=404, detail=f"order {id} not found")

@router.get("/get-order-details/{id_order}", response_description="Get order details list")
async def get_order_details(id_order: int, request: Request):
    order_details = []
    for order_detail in await request.app.mongodb["order_details"].find().to_list(length=100):
        if isinstance(order_detail['_id'], int):
            if (order_detail['order_id'] == id_order):
                order_details.append(order_detail)

    return order_details