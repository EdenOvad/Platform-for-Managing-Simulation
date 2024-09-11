import motor.motor_asyncio
import bson
from bson import ObjectId
from dotenv import load_dotenv
import os

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")


client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
db = client.get_database("db_simulation")
jobs_collection = db.get_collection("jobs")
users_collection = db.get_collection("users")


async def insertSimulation(data: object):
    await jobs_collection.insert_one(data)


async def deleteSimulation(data: object):
    await jobs_collection.delete_one(data)


async def popSimulation(data: str):
    simulations = []
    async with jobs_collection.find({"user_id": data}, {"simulation_name": 1, "date": 1, "params": 1, "path": 1, "_id": 1}) as cursor:
        async for document in cursor:
            if document["simulation_name"]:
                simulations.append({"simulation_name": document["simulation_name"], "date": document["date"], "parameters": document[
                                   "params"], "isRunning": "true", "path": document["path"], "simulation_id": str(document['_id'])})
            else:
                continue
    return simulations


async def update_simulation_db(data: object, simulation_id: str, user_id: str):
    # Parse the params field
    params = data['params'].split(',')
    num_jobs = params[0] if len(params) > 0 else ""
    num_cores = params[1] if len(params) > 1 else ""
    ring_size = params[2] if len(params) > 2 else ""
    routing = params[3] if len(params) > 3 else ""
    seed = params[4] if len(params) > 4 else ""

    # Create the new path based on the updated parameters
    new_path = f"./flooddns/runs/seed_{seed}/concurrent_jobs_{num_jobs}/{num_cores}_core_failures/ring_size_{ring_size}/{routing}"

    # Update the path in the data object
    data['path'] = new_path

    result = await jobs_collection.find_one_and_update(
        {"user_id": user_id, "_id": ObjectId(simulation_id)},
        {"$set": {
            "params": str(data['params']),
            "result": str(data['result']),
            "simulation_name": data.get('simulation_name', ""),
            "path": new_path,
            "start_time": data['start_time'],
            "end_time": data['end_time']
        }},
        return_document=True
    )
    return result


async def popResults(user_id: str, data: str):
    async with jobs_collection.find({"user_id": user_id, "_id": ObjectId(data)}, {"result": 1}) as cursor:
        async for document in cursor:
            if document["result"]:
                return document["result"]
