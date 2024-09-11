from fastapi import FastAPI, Request, APIRouter, HTTPException
from flooddns.external.simulation.main import local_run
from models.simulation import SimulationPayload, TemporyPayload
import os
import pandas as pd
import subprocess
from schemas.simulation import deleteSimulation, popSimulation, insertSimulation, update_simulation_db, popResults
from datetime import datetime
from bson.objectid import ObjectId
from pymongo import MongoClient
import logging

router = APIRouter()

# MongoDB connection
client = MongoClient("mongodb://localhost:27017")
db = client.db_simulation
collection = db.jobs

# Check the connection
try:
    client.server_info()  # Forces a call to the server
    print("MongoDB connection successful")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")


@router.post("/simulate_flood_dns")
async def run_simulation(request: Request):
    payload = await request.json()
    payload_data = SimulationPayload(
        simulation_name=payload['params']['simulation_name'],
        num_jobs=payload['params']['num_jobs'],
        num_tors=payload['params']['num_tors'],
        n_cores=payload['params']['num_cores'],
        ring_size=payload['params']['ring_size'],
        routing=payload['params']['routing'],
        path=payload['params']['path'],
        seed=payload['params']['seed']
    )
    simulation_data = TemporyPayload(
        simulation_name=payload['params']['simulation_name'],
        num_jobs=payload['params']['num_jobs'],
        num_tors=payload['params']['num_tors'],
        n_cores=payload['params']['num_cores'],
        ring_size=payload['params']['ring_size'],
        routing=payload['params']['routing'],
        path=payload['params']['path'],
        seed=payload['params']['seed']
    )

    start_time = datetime.now()
    result = await local_run(
        num_jobs=payload_data.num_jobs,
        num_tors=payload_data.num_tors,
        n_cores=payload_data.n_cores,
        ring_size=payload_data.ring_size,
        routing=payload_data.routing,
        seed=payload_data.seed
    )
    end_time = datetime.now()

    print(result)
    if result == "You can`t create simulation with your parameters":
        print(result)
        current_date = datetime.today().strftime('%Y-%m-%d')

        simulation = {
            "simulation_name": str(simulation_data.simulation_name),
            "path": "",
            "date": current_date,
            "params": str(payload_data.num_jobs) + "," + str(payload_data.n_cores) + "," + str(payload_data.ring_size) + "," + str(payload_data.routing) + "," + str(payload_data.seed),
            "user_id": str(payload['user_id']),
            "result": result,
            "start_time": start_time.isoformat(),
            "end_time": end_time.isoformat()
        }
        await insertSimulation(simulation)
        simulations1 = await popSimulation(str(payload['user_id']))
        return {"data": simulations1, "progress": result}

    job_info_path = os.path.join(".", "flooddns", "runs", f"seed_{payload_data.seed}", f"concurrent_jobs_{payload_data.num_jobs}",
                                 f"{payload_data.n_cores}_core_failures", f"ring_size_{payload_data.ring_size}", payload_data.routing, "logs_floodns", "job_info.csv")
    job_path = os.path.join(".", "flooddns", "runs", f"seed_{payload_data.seed}", f"concurrent_jobs_{payload_data.num_jobs}",
                            f"{payload_data.n_cores}_core_failures", f"ring_size_{payload_data.ring_size}", payload_data.routing)
    job_info_path = job_info_path.replace("\\", "/")
    job_path = job_path.replace("\\", "/")
    job_info = pd.read_csv(job_info_path, header=None)
    if job_info.empty:
        print("No jobs found.")
        return
    job_csv = os.path.join(".", "flooddns", "runs",
                           "headers", "job_info.header")
    job_columns = pd.read_csv(job_csv)
    job_info.columns = job_columns.columns
    current_date = datetime.today().strftime('%Y-%m-%d')

    simulation = {
        "simulation_name": str(simulation_data.simulation_name),
        "path": job_path,
        "date": current_date,
        "params": str(payload_data.num_jobs) + "," + str(payload_data.n_cores) + "," + str(payload_data.ring_size) + "," + str(payload_data.routing) + "," + str(payload_data.seed),
        "user_id": str(payload['user_id']),
        "result": result,
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat()
    }
    await insertSimulation(simulation)
    simulations1 = await popSimulation(str(payload['user_id']))
    return {"data": simulations1, "progress": result, "tempID": payload["params"]["tempID"]}


@router.post("/get_simulate_flood_dns")
async def get_simulation(request: Request):
    user_id = await request.json()
    simulations1 = await popSimulation(str(user_id["state"]))
    return simulations1
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@router.post("/re_run_simulation")
async def re_run_simulation(request: Request):
    params = await request.json()
    payload = params['data']
    simulation_id = params['simulation_id']
    user_id = params['user_id']

    # Extract the parameters from the current simulation
    current_simulation = collection.find_one(
        {"_id": ObjectId(simulation_id), "user_id": user_id})
    if not current_simulation:
        raise HTTPException(status_code=404, detail="Simulation not found")

    # Extracting parameters from the current simulation
    current_params = current_simulation['params'].split(',')
    num_jobs = current_params[0]
    num_cores = current_params[1]
    ring_size = current_params[2]
    routing = current_params[3]
    seed = current_params[4]

    # Running the simulation with the current parameters
    start_time = datetime.now()
    process = subprocess.Popen(["java", "-jar", "./flooddns/floodns-basic-sim.jar",
                               payload], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output, _ = process.communicate()
    end_time = datetime.now()
    output = output.decode('utf-8')

    # Prepare the updated simulation details
    new_path = f"./flooddns/runs/seed_{seed}/concurrent_jobs_{num_jobs}/{num_cores}_core_failures/ring_size_{ring_size}/{routing}"
    simulation = {
        "simulation_name": current_simulation['simulation_name'],
        "path": new_path,
        "date": current_simulation['date'],
        "params": f"{num_jobs},{num_cores},{ring_size},{routing},{seed}",
        "user_id": user_id,
        "result": output,
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat(),
        "seed": seed
    }

    # Update the simulation in the database with new start and end times
    await update_simulation_db(simulation, simulation_id, user_id)

    return {"result": output, "start_time": start_time.isoformat(), "end_time": end_time.isoformat()}


@router.post("/delte_simulation")
async def delte_simulation(request: Request):
    params = await request.json()
    payload = params['data']
    await deleteSimulation({"_id": ObjectId(payload)})
    simulations1 = await popSimulation(str(params['user_id']))
    return simulations1


@router.post("/simulation_update")
async def update_simulation(request: Request):
    payload = await request.json()

    # Extracting parameters from the payload
    params = payload['params']
    simulation_id = payload['simulationID']
    user_id = payload['user_id']

    # Creating payload_data and simulation_data from the parameters
    payload_data = SimulationPayload(
        simulation_name=params['simulation_name'],
        num_jobs=params['num_jobs'],
        num_tors=params['num_tors'],
        n_cores=params['num_cores'],
        ring_size=params['ring_size'],
        routing=params['routing'],
        path=params['path'],
        seed=params['seed']
    )
    simulation_data = TemporyPayload(
        simulation_name=params['simulation_name'],
        num_jobs=params['num_jobs'],
        num_tors=params['num_tors'],
        n_cores=params['num_cores'],
        ring_size=params['ring_size'],
        routing=params['routing'],
        path=params['path'],
        seed=params['seed']
    )

    # Running the simulation with the new parameters
    start_time = datetime.now()
    result = await local_run(
        num_jobs=payload_data.num_jobs,
        num_tors=payload_data.num_tors,
        n_cores=payload_data.n_cores,
        ring_size=payload_data.ring_size,
        routing=payload_data.routing,
        seed=payload_data.seed
    )
    end_time = datetime.now()

    # Prepare the updated simulation details
    current_date = datetime.today().strftime('%Y-%m-%d')
    simulation = {
        "simulation_name": str(simulation_data.simulation_name),
        "path": "",
        "date": current_date,
        "params": f"{payload_data.num_jobs},{payload_data.n_cores},{payload_data.ring_size},{payload_data.routing},{payload_data.seed}",
        "user_id": str(user_id),
        "result": result,
        "start_time": start_time.isoformat(),
        "end_time": end_time.isoformat(),
        "seed": simulation_data.seed
    }

    # Checking if the result indicates a failure to create the simulation
    if result == "You can't create simulation with your parameters":
        await update_simulation_db(simulation, simulation_id, user_id)
        simulations1 = await popSimulation(str(user_id))
        return {"data": simulations1, "progress": result}

    # If the simulation ran successfully, update the path and other details
    job_info_path = os.path.join(
        ".", "flooddns", "runs", f"seed_{payload_data.seed}",
        f"concurrent_jobs_{payload_data.num_jobs}",
        f"{payload_data.n_cores}_core_failures",
        f"ring_size_{payload_data.ring_size}", payload_data.routing, "logs_floodns", "job_info.csv"
    )
    job_path = os.path.join(
        ".", "flooddns", "runs", f"seed_{payload_data.seed}",
        f"concurrent_jobs_{payload_data.num_jobs}",
        f"{payload_data.n_cores}_core_failures",
        f"ring_size_{payload_data.ring_size}", payload_data.routing
    )
    job_info_path = job_info_path.replace("\\", "/")
    job_path = job_path.replace("\\", "/")
    job_info = pd.read_csv(job_info_path, header=None)

    if job_info.empty:
        print("No jobs found.")
        return

    job_csv = os.path.join(".", "flooddns", "runs",
                           "headers", "job_info.header")
    job_columns = pd.read_csv(job_csv)
    job_info.columns = job_columns.columns

    simulation["path"] = job_path

    # Update the simulation in the database
    await update_simulation_db(simulation, simulation_id, user_id)
    simulations1 = await popSimulation(str(user_id))
    return {"data": simulations1, "progress": result}


@router.post("/show_result")
async def show_results(request: Request):
    payload = await request.json()
    result = await popResults(str(payload["user_id"]), str(payload['data']))
    return result


@router.get("/get_experiment/{id}")
async def get_experiment(id: str):
    logging.info(f"Fetching experiment with ID: {id}")
    try:
        obj_id = ObjectId(id)
        experiment = collection.find_one({"_id": obj_id})
        if experiment is None:
            logging.error(f"Experiment with ID {id} not found in collection.")
            raise HTTPException(
                status_code=404, detail="Experiment not found in collection")
        # Convert ObjectId to string for JSON serialization
        experiment['_id'] = str(experiment['_id'])
        logging.info(f"Found experiment: {experiment}")
        return experiment
    except Exception as e:
        logging.error(f"Error fetching experiment with ID {id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/get_files/{path:path}")
async def get_files(path: str):
    try:
        # Ensure the path is absolute
        base_path = os.path.join(os.getcwd(), path)
        logging.info(f"Checking path: {base_path}")

        if not os.path.exists(base_path):
            raise HTTPException(status_code=404, detail="Path not found")

        files_list = []
        for root, dirs, files in os.walk(base_path):
            for file in files:
                files_list.append(os.path.join(root, file).replace("\\", "/"))

        return {"files": files_list}
    except Exception as e:
        logging.error(f"Error fetching files from path {path}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/get_file_content/{path:path}")
async def get_file_content(path: str):
    try:
        # Correct the path
        base_path = os.path.join(os.getcwd(), path).replace("/./", "/")
        logging.info(f"Fetching file content from: {base_path}")

        if not os.path.exists(base_path):
            raise HTTPException(status_code=404, detail="File not found")

        with open(base_path, 'r') as file:
            content = file.read()

        return {"content": content}
    except Exception as e:
        logging.error(f"Error fetching file content from {path}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
