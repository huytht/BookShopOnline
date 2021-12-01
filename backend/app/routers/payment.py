from fastapi import APIRouter, Body, Request, HTTPException, status, Response, Form
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.logger import logger
from ..models.payment import PaymentModel, PaymentUpdateModel
from typing import List

router = APIRouter()

async def getNextSequence(name: str, request: Request):
    ret = await request.app.mongodb["payment"].find_one_and_update(
        filter={"_id": name},
        upsert=True, 
        update={"$inc": {"seq": 1}},
        return_document=True
    )

    return f"{ret['seq']}"

@router.get("/", response_description="List all payment")
async def list_payment(request: Request):
    payments = []
    for doc in await request.app.mongodb["payment"].find().to_list(length=100):
        if isinstance(doc["_id"], int):
            payments.append(doc)

    return payments

@router.get("/get-payment/{id}", response_description="Get payment detail")
async def get_payment(id: int, request: Request):
    if (payment := await request.app.mongodb["payment"].find_one({"_id": id})) is not None:
        return payment
    
    raise HTTPException(status_code=404, detail="payment {id} not found")

@router.post("/create-payment/")
async def create_payment(request: Request, payment: PaymentModel = Body(...)):
    payment = jsonable_encoder(payment)
    new_payment = await request.app.mongodb["payment"].insert_one({
        "_id": int(await getNextSequence("paymentid", request)),
        "name": payment['name']
    })
    
    created_payment = await request.app.mongodb["payment"].find_one(
        {"_id": new_payment.inserted_id}
    )

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_payment)

@router.put("/update-payment/{id}")
async def update_payment(id: int, request: Request, payment: PaymentUpdateModel = Body(...)):
    payment = {k: v for k, v in payment.dict().items() if v is not None}

    if (len(payment) >= 1):
        update_payment_result = await request.app.mongodb["payment"].update_one(
            {"_id": id},
            {"$set": payment}
        )

        if update_payment_result.modified_count == 1:
            if (update_payment := await request.app.mongodb["payment"].find_one(
                {"_id": id}
            )) is not None:
                return update_payment

    if (existing_payment := await request.app.mongodb["payment"].find_one(
            {"_id": id}
        )) is not None:
        return existing_payment
    
    raise HTTPException(status_code=404, detail=f"payment {id} not found")

@router.delete("/delete-payment/{id}")
async def delete_payment(id: int, request: Request):
    delete_payment = await request.app.mongodb["payment"].delete_one({"_id": id})

    if delete_payment.deleted_count == 1:
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)

    raise HTTPException(status_code=404, detail=f"payment {id} not found")

@router.get("/check-payment/{name}")
async def check_payment(name: str, request: Request):
    for payment in await list_payment(request):
        if payment['name'].lower() == name.lower():
            return True

    return False

@router.get("/check-payment/{name}/{id}")
async def check_payment(name: str, id: int, request: Request):
    for payment in await list_payment(request):
        if payment['name'].lower() == name.lower() and payment['_id'] != id:
            return True

    return False