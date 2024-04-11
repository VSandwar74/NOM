import asyncio
from fastapi import FastAPI, WebSocket
from typing import List
from utils.Orderbook import OrderBook, Order
from collections import defaultdict
from websocket_manager import WebsocketManager

app = FastAPI()

order_book_map: dict[str, OrderBook] = {}
contract_websockets: dict[str, List[WebSocket]] = defaultdict(list)
event_map: dict[str, asyncio.Event] = defaultdict(asyncio.Event)
new_orders: dict[str, List[Order]] = defaultdict(list)

@app.post("/create-orderbook")
async def create_orderbook(token_pair: str):
    """
    Create an orderbook for the given token pair.

    Args:
        token_pair (str): The token pair for which the orderbook needs to be created.

    Returns:
        dict: A dictionary containing a message indicating whether the orderbook was created or already exists.
    """
    if token_pair not in order_book_map:
        order_book_map[token_pair] = OrderBook()
        return {"message": "Orderbook created."}
    return {"message": "Orderbook already exists."}

@app.post("/place-order")
async def place_order(token_pair: str, order: Order):
    """
    Place an order for a given token pair.

    Args:
        token_pair (str): The token pair for which the order is being placed.
        order (Order): The order to be placed.

    Returns:
        dict: A dictionary containing a message indicating the success or failure of the order placement.
    """
    if token_pair in order_book_map:
        order_book_map[token_pair].placeOrder(order)
        new_orders[token_pair].append(order)
        event_map[token_pair].set()
        return {"message": "Order placed successfully!"}
    return {"message": "Orderbook for this token pair does not exist."}

@app.websocket("/order-data/{token_pair}")
async def options_contract_websocket(websocket: WebSocket, token_pair: str):
    """
    WebSocket endpoint for handling options contract data.

    Args:
        websocket (WebSocket): The WebSocket connection.
        token_pair (str): The token pair for which the data is requested.

    Returns:
        None

    Raises:
        Exception: If there is a disconnection or error.

    """
    await websocket.accept()
    contract_websockets[token_pair].append(websocket)
    try:
        while True:
            await event_map[token_pair].wait()
            for order in new_orders[token_pair]:
                await websocket.send_json(order)
            event_map[token_pair].clear()
    except Exception as e:
        # Handle disconnection or error
        contract_websockets[token_pair].remove(websocket)
        print(f"Websocket disconnected: {e}")
    finally:
        # Make sure to clean up on disconnect
        if websocket in contract_websockets[token_pair]:
            contract_websockets[token_pair].remove(websocket)



#mongoDB setup:
from pymongo import MongoClient 
import os
from dotenv import dotenv_values

config = dotenv_values(".env")

@app.on_event("startup")
def connection_to_db():
    #connection string
    app.mongodb_client = MongoClient(config['ATLAS_URI'])
    app.database = app.mongodb_client[config['DB_NAME']]

@app.on_event("shutdown")
def disconnect_from_db():
    app.mongodb_client.close()


