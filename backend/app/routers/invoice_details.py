from fastapi import APIRouter, Body, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from ..models.invoice_details import InvoiceDetailsModel, InvoiceDetailsUpdateModel
import time

router = APIRouter()

@router.get("/", response_description="List all invoice_details")
async def list_invoice_details(request: Request):
    invoice_details = []
    for invoice_detail in await request.app.mongodb["invoice_details"].find().to_list(length=100):
        if (book := await request.app.mongodb["book"].find_one({"_id": invoice_detail['book_id']})) is not None:
            invoice_detail['book_title'] = book['title']
            invoice_detail['book_isbn'] = book['isbn']
            invoice_detail['book_price'] = book['price']
        invoice_details.append(invoice_detail)

    return invoice_details

@router.get("/get-invoice-detail/{id}", response_description="Get invoice details")
async def get_invoice_detail(id: str, request: Request):
    if (invoice_detail := await request.app.mongodb["invoice_details"].find_one({"_id": id})) is not None:
        return invoice_detail
    
    raise HTTPException(status_code=404, detail="InvoiceDetails {id} not found")

@router.get("/get-invoice-details/{id_invoice}", response_description="Get invoice_details list")
async def get_invoice_details(id_invoice: str, request: Request):
    invoice_details = []
    for invoice_detail in await request.app.mongodb["invoice_details"].find().to_list(length=100):
        if (invoice_detail['invoice_id'] == id_invoice):
            invoice_details.append(invoice_detail)

    return invoice_details

@router.post("/create-invoice-detail/")
async def create_invoice_detail(request: Request, invoice_detail: InvoiceDetailsModel = Body(...)):
    invoice_detail = jsonable_encoder(invoice_detail)
    new_invoice_detail = await request.app.mongodb["invoice_details"].insert_one(invoice_detail)
    created_invoice_detail = await request.app.mongodb["invoice_details"].find_one(
        {"_id": new_invoice_detail.inserted_id}
    )

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_invoice_detail)

@router.put("/update-invoice-detail/{id}")
async def update_invoice_detail(id: str, request: Request, invoice_detail: InvoiceDetailsUpdateModel = Body(...)):
    invoice_detail = {k: v for k, v in invoice_detail.dict().items() if v is not None}

    if (len(invoice_detail) >= 1):
        update_invoice_detail_result = await request.app.mongodb["invoice_details"].update_one(
            {"_id": id},
            {"$set": invoice_detail}
        )

        if update_invoice_detail_result.modified_count == 1:
            if (update_invoice_detail := await request.app.mongodb["invoice_details"].find_one(
                {"_id": id}
            )) is not None:
                return update_invoice_detail

    if (existing_invoice_detail := await request.app.mongodb["invoice_details"].find_one(
            {"_id": id}
        )) is not None:
        return existing_invoice_detail
    
    raise HTTPException(status_code=404, detail=f"invoice_detail {id} not found")

@router.delete("/delete-invoice-detail/{id}")
async def delete_invoice_detail(id: str, request: Request):
    delete_invoice_detail = await request.app.mongodb["invoice_details"].delete_one({"_id": id})

    if delete_invoice_detail.deleted_count == 1:
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)

    raise HTTPException(status_code=404, detail=f"invoice_details {id} not found")
