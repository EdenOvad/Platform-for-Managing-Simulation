import motor.motor_asyncio
import bcrypt
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
db = client.get_database("db_simulation")
users_collection = db.get_collection("users")


async def get_user(data: str):
    return await users_collection.find_one({"username": data})


async def save_user(data: object):
    if await users_collection.find_one({"username": data["username"]}):
        return "User is already registered!"
    else:
        hashpassword = bcrypt.hashpw(
            data["password"].encode("utf-8"), bcrypt.gensalt(10))
        data['password'] = hashpassword
        users_collection.insert_one(data)
        return "Register successed!"
