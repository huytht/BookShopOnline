from fastapi import APIRouter, Body, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from ..models.cart import CartModel, CartUpdateModel
import time

router = APIRouter()

async def getNextSequence(name: str, request: Request):
    ret = await request.app.mongodb["cart"].find_one_and_update(
        filter={"_id": name},
        upsert=True,
        update={"$inc": {"seq": 1}},
        return_document=True
    )

    return f"{ret['seq']}"

@router.get("/", response_description="List all cart")
async def list_cart(request: Request):
    carts = []
    for cart in await request.app.mongodb["cart"].find().to_list(length=100):
        
        if isinstance(cart["_id"], int):
            if (user := await request.app.mongodb["user"].find_one({"_id": cart['user_id']})) is not None:
                cart['user_id'] = user['username']
            carts.append(cart)

    return carts

@router.get("/get-cart/{id}", response_description="Get Carts")
async def get_cart(id: int, request: Request):
    if (cart := await request.app.mongodb["cart"].find_one({"_id": id})) is not None:
        return cart

    raise HTTPException(status_code=404, detail="Cart {id} not found")

@router.get("/get-cart-items/{id_cart}", response_description="Get cart items list")
async def get_cart_items(id_cart: int, request: Request):
    cartItems = []
    for cart_item in await request.app.mongodb["cart_items"].find().to_list(length=100):
        if isinstance(cart_item['_id'], int):
            if (cart_item['cart_id'] == id_cart):
                if (book := await request.app.mongodb["book"].find_one({"_id": cart_item['book_id']})) is not None:
                    cart_item['book'] = book
                    cartItems.append(cart_item)

    return cartItems

@router.post("/create-cart/")
async def create_cart(request: Request, cart: CartModel = Body(...)):
    cart = jsonable_encoder(cart)
    cart['created_date'] = int(time.time())
    cart['_id'] = int(await getNextSequence("cartid", request))
    new_cart = await request.app.mongodb["cart"].insert_one(cart)
    created_cart = await request.app.mongodb["cart"].find_one(
        {"_id": new_cart.inserted_id}
    )

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_cart)


@router.put("/update-cart/{id}")
async def update_cart(id: int, request: Request, cart: CartUpdateModel = Body(...)):
    cart = {k: v for k, v in cart.dict().items() if v is not None}

    if (len(cart) >= 1):
        update_cart_result = await request.app.mongodb["cart"].update_one(
            {"_id": id},
            {"$set": cart}
        )

        if update_cart_result.modified_count == 1:
            if (update_cart := await request.app.mongodb["cart"].find_one(
                {"_id": id}
            )) is not None:
                return update_cart

    if (existing_cart := await request.app.mongodb["cart"].find_one(
        {"_id": id}
    )) is not None:
        return existing_cart

    raise HTTPException(status_code=404, detail=f"cart {id} not found")


@router.delete("/delete-cart/{id}")
async def delete_cart(id: int, request: Request):
    delete_cart = await request.app.mongodb["cart"].delete_one({"_id": id})

    if delete_cart.deleted_count == 1:
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)

    raise HTTPException(status_code=404, detail=f"cart {id} not found")
