from fastapi import APIRouter, HTTPException, Depends
from typing import List
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.client import Client, ClientCreate, ClientUpdate
from database import get_database
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/clients", tags=["clients"])

@router.post("/", response_model=Client)
async def create_client(
    client_data: ClientCreate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Create a new client"""
    try:
        client = Client(**client_data.dict())
        client_dict = client.dict()
        
        # Convert datetime to string for MongoDB
        client_dict["created_at"] = client_dict["created_at"].isoformat()
        
        result = await db.clients.insert_one(client_dict)
        if result.inserted_id:
            logger.info(f"Created client: {client.name}")
            return client
        else:
            raise HTTPException(status_code=500, detail="Failed to create client")
    except Exception as e:
        logger.error(f"Error creating client: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[Client])
async def get_clients(
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get all clients"""
    try:
        clients = await db.clients.find().to_list(1000)
        
        # Convert datetime strings back to datetime objects for response
        for client in clients:
            client["created_at"] = client["created_at"]
            if client.get("last_test_date"):
                client["last_test_date"] = client["last_test_date"]
        
        return [Client(**client) for client in clients]
    except Exception as e:
        logger.error(f"Error fetching clients: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{client_id}", response_model=Client)
async def get_client(
    client_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get a specific client by ID"""
    try:
        client = await db.clients.find_one({"id": client_id})
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")
        
        # Convert datetime strings back to datetime objects
        client["created_at"] = client["created_at"]
        if client.get("last_test_date"):
            client["last_test_date"] = client["last_test_date"]
        
        return Client(**client)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching client {client_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{client_id}", response_model=Client)
async def update_client(
    client_id: str,
    client_data: ClientUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Update a client"""
    try:
        # Only include non-None fields in update
        update_data = {k: v for k, v in client_data.dict().items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        result = await db.clients.update_one(
            {"id": client_id},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Client not found")
        
        # Get updated client
        updated_client = await db.clients.find_one({"id": client_id})
        updated_client["created_at"] = updated_client["created_at"]
        if updated_client.get("last_test_date"):
            updated_client["last_test_date"] = updated_client["last_test_date"]
        
        return Client(**updated_client)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating client {client_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{client_id}")
async def delete_client(
    client_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Delete a client and all associated test results"""
    try:
        # Delete all test results for this client
        await db.test_results.delete_many({"client_id": client_id})
        
        # Delete the client
        result = await db.clients.delete_one({"id": client_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Client not found")
        
        logger.info(f"Deleted client: {client_id}")
        return {"message": "Client deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting client {client_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))