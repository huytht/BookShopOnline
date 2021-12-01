from fastapi import APIRouter, Body, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from ..models.address import AddressModel, AddressUpdateModel
import time

router = APIRouter()

async def getNextSequence(name: str, request: Request):
    ret = await request.app.mongodb["address"].find_one_and_update(
        filter={"_id": name},
        upsert=True, 
        update={"$inc": {"seq": 1}},
        return_document=True
    )

    return f"{ret['seq']}"

@router.get("/", response_description="List all address")
async def list_addresss(request: Request):
    addresses = []
    for address in await request.app.mongodb["address"].find().to_list(length=100):
        if isinstance(address["_id"], int):
            addresses.append(address)

    return addresses

@router.get("/get-address/{id}", response_description="Get address detail")
async def get_address(id: int, request: Request):
    if (address := await request.app.mongodb["address"].find_one({"_id": id})) is not None:
        return address
    
    raise HTTPException(status_code=404, detail="Address {id} not found")

@router.post("/create-address/")
async def create_address(request: Request, address: AddressModel = Body(...)):
    address = jsonable_encoder(address)
    address['_id'] = int(await getNextSequence("addressid", request))
    new_address = await request.app.mongodb["address"].insert_one(address)
    created_address = await request.app.mongodb["address"].find_one(
        {"_id": new_address.inserted_id}
    )

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_address)

@router.put("/update-address/{id}")
async def update_address(id: int, request: Request, address: AddressUpdateModel = Body(...)):
    address = {k: v for k, v in address.dict().items() if v is not None}

    if (len(address) >= 1):
        update_address_result = await request.app.mongodb["address"].update_one(
            {"_id": id},
            {"$set": address}
        )

        if update_address_result.modified_count == 1:
            if (update_address := await request.app.mongodb["address"].find_one(
                {"_id": id}
            )) is not None:
                return update_address

    if (existing_address := await request.app.mongodb["address"].find_one(
            {"_id": id}
        )) is not None:
        return existing_address
    
    raise HTTPException(status_code=404, detail=f"address {id} not found")

@router.delete("/delete-address/{id}")
async def delete_address(id: int, request: Request):
    delete_address = await request.app.mongodb["address"].delete_one({"_id": id})

    if delete_address.deleted_count == 1:
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)

    raise HTTPException(status_code=404, detail=f"address {id} not found")
