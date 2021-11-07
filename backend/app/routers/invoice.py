from fastapi import APIRouter, Body, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from ..models.invoice import InvoiceModel, InvoiceUpdateModel
from .invoice_details import delete_invoice_detail, get_invoice_details
import time

router = APIRouter()

@router.get("/", response_description="List all invoice")
async def list_invoices(request: Request):
    invoices = []
    for invoice in await request.app.mongodb["invoice"].find().to_list(length=100):
        if (user := await request.app.mongodb["user"].find_one({"_id": invoice['user_id']})) is not None:
            invoice['user_id'] = user['username']
        if (payment := await request.app.mongodb["payment"].find_one({"_id": invoice['payment_id']})) is not None:
            invoice['payment_id'] = payment['name'] 
        invoices.append(invoice)

    return invoices

@router.get("/get-invoice/{id}", response_description="Get invoice detail")
async def get_invoice(id: str, request: Request):
    if (invoice := await request.app.mongodb["invoice"].find_one({"_id": id})) is not None:
        return invoice
    
    raise HTTPException(status_code=404, detail="Invoice {id} not found")

@router.post("/create-invoice/")
async def create_invoice(request: Request, invoice: InvoiceModel = Body(...)):
    invoice = jsonable_encoder(invoice)
    invoice['created_date'] = int(time.time())
    new_invoice = await request.app.mongodb["invoice"].insert_one(invoice)
    created_invoice = await request.app.mongodb["invoice"].find_one(
        {"_id": new_invoice.inserted_id}
    )

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=created_invoice)

@router.put("/update-invoice/{id}")
async def update_invoice(id: str, request: Request, invoice: InvoiceUpdateModel = Body(...)):
    invoice = {k: v for k, v in invoice.dict().items() if v is not None}

    if (len(invoice) >= 1):
        update_invoice_result = await request.app.mongodb["invoice"].update_one(
            {"_id": id},
            {"$set": invoice}
        )

        if update_invoice_result.modified_count == 1:
            if (update_invoice := await request.app.mongodb["invoice"].find_one(
                {"_id": id}
            )) is not None:
                return update_invoice

    if (existing_invoice := await request.app.mongodb["invoice"].find_one(
            {"_id": id}
        )) is not None:
        return existing_invoice
    
    raise HTTPException(status_code=404, detail=f"invoice {id} not found")

@router.delete("/delete-invoice/{id}")
async def delete_invoice(id: str, request: Request):
    delete_invoice = await request.app.mongodb["invoice"].delete_one({"_id": id})

    if delete_invoice.deleted_count == 1:
        for invoice_detail in await get_invoice_details(id, request):
            await delete_invoice_detail(invoice_detail['_id'], request)
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)

    raise HTTPException(status_code=404, detail=f"invoice {id} not found")
