from pymongo import MongoClient 
import os
from dotenv import dotenv_values

config = dotenv_values(".env")

@app.on_event("startup")
def connection_to_db():
    #connection string
    client = MongoClient(config['ATLAS_URI'])
    db = client[config['DB_NAME']]

def disconnect_from_db()

if __name__ == "__main__":
    connect_to