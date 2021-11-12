from fastapi import APIRouter, Body, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from ..models.cart_items import CartItemsModel, CartItemsUpdateModel
import time

router = APIRouter()

async def getNextSequence(name: str, request: Request):
    ret = await request.app.mongodb["cart_items"].find_one_and_update(
        filter={"_id": name},
        upsert=True,
        update={"$inc": {"seq": 1}},
        return_document=True
    )

    return f"{ret['seq']}"

@router.get("/", response_description="List all cart items")
async def list_cart_items(request: Request):
    cart_items = []
    for cart_item in await request.app.mongodb["cart_items"].find().to_list(length=100):
        if isinstance(cart_item["_id"], int):
            cart_items.append(cart_item)

    return cart_items

@router.get("/get-cart-items/{id}", response_description="Get Cart Items")
async def get_cart_items(id: int, request: Request):
    if (cart_items := await request.app.mongodb["cart_items"].find_one({"_id": id})) is not None:
        return cart_items

    raise HTTPException(status_code=404, detail="CartItems {id} not found")


@router.post("/create-cart-items/")
async def create_cart_items(request: Request, cart_items: CartItemsModel = Body(...)):
    cart_items = jsonable_encoder(cart_items)
    cart_items['_id'] = int(await getNextSequence("cartitemsid", request))
    new_cart_items = await request.app.mongodb["cart_items"].insert_one(cart_items)
    created_cart_items = await request.app.mongodb["cart_items"].find_one(
        {"_id": new_cart_items.inserted_id}
    )

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_cart_items)


@router.put("/update-cart-items/{id}")
async def update_cart_items(id: int, request: Request, cart_items: CartItemsUpdateModel = Body(...)):
    cart_items = {k: v for k, v in cart_items.dict().items() if v is not None}

    if (len(cart_items) >= 1):
        update_cart_items_result = await request.app.mongodb["cart_items"].update_one(
            {"_id": id},
            {"$set": cart_items}
        )

        if update_cart_items_result.modified_count == 1:
            if (update_cart_items := await request.app.mongodb["cart_items"].find_one(
                {"_id": id}
            )) is not None:
                return update_cart_items

    if (existing_cart_items := await request.app.mongodb["cart_items"].find_one(
        {"_id": id}
    )) is not None:
        return existing_cart_items

    raise HTTPException(status_code=404, detail=f"cart_items {id} not found")


@router.delete("/delete-cart-items/{id}")
async def delete_cart_items(id: int, request: Request):
    delete_cart_items = await request.app.mongodb["cart_items"].delete_one({"_id": id})

    if delete_cart_items.deleted_count == 1:
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)

    raise HTTPException(status_code=404, detail=f"cart_items {id} not found")
