from fastapi import APIRouter
from app.api.routes import user
from app.api.routes import utils
from app.api.routes import auth
from app.api.routes import profile
from app.api.routes import posts

api_router = APIRouter()
api_router.include_router(user.router)
api_router.include_router(utils.router)
api_router.include_router(auth.router)
api_router.include_router(profile.router)
api_router.include_router(posts.router)
