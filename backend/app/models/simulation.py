from pydantic import BaseModel, create_model


class SimulationPayload(BaseModel):
    simulation_name: str
    num_jobs: int
    num_tors: int
    n_cores: int
    ring_size: int
    routing: str
    seed: int


class TemporyPayload(BaseModel):
    simulation_name: str
    num_jobs: int
    num_tors: int
    n_cores: int
    ring_size: int
    routing: str
    seed: int


class User(BaseModel):
    username: str
    email: str
    password: str
