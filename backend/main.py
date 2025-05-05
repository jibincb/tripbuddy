# main.py
from fastapi import FastAPI
from pydantic import BaseModel
from agent import run
from fastapi.middleware.cors import CORSMiddleware
 
class Info(BaseModel):
    destination: str
    budget_preference: str
    days: int


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  #
    allow_headers=["*"], 
)

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@app.post("/process-data")
def process_data(info: Info):
    destination = info.destination
    budget_preference = info.budget_preference
    days = info.days
    response = run(destination, budget_preference, days)
    print(type(response))
    return response