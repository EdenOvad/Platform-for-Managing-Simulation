from fastapi import FastAPI, APIRouter, Request, HTTPException
import bcrypt
from schemas.user import get_user, save_user
import jwt
import time
from decouple import config

router = APIRouter()

JWT_SECRET = config("secret", default="default_secret_value")
JWT_ALGORITHM = config("algorithm", default="HS256")


@router.post("/login")
async def authUser(request: Request):
    user = await request.json()
    result = await get_user(user["username"])
    password = user['password'].encode('utf-8')
    if result:
        if bcrypt.checkpw(password, result["password"]):
            payload = {
                "user_id": str(result["_id"]),
                "user_name": str(result['username']),
                "expires": time.time() + 600
            }
            return jwt.encode(
                payload,
                JWT_SECRET,
                algorithm=JWT_ALGORITHM
            )
        else:
            raise HTTPException(status_code=400, detail="Password error")
    else:
        raise HTTPException(status_code=400, detail="User not registered")


@router.post("/register")
async def register(request: Request):
    user = await request.json()
    print(user)
    result = await save_user(user)
    print(result)
    if result.strip() == "Register successed!":
        resultUser = await get_user(user["username"])
        payload = {
            "user_id": str(resultUser["_id"]),
            "user_name": str(resultUser['username']),
            "expires": time.time() + 600
        }
        return jwt.encode(
            payload,
            JWT_SECRET,
            algorithm=JWT_ALGORITHM
        )
    return result
