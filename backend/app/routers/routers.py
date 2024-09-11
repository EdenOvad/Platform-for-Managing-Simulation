from fastapi import APIRouter
from controllers.simulator import router as controller_router
from controllers.user import router as user_router

api_router = APIRouter()
api_router.include_router(controller_router, prefix="/api")
api_router.include_router(user_router, prefix="/api")