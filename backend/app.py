import asyncio
from fastapi import FastAPI, WebSocket, HTTPException
from typing import List, Any
from utils.Orderbook import OrderBook, Order
from collections import defaultdict
from websocket_manager import WebsocketManager
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from db import add_to_db, remove_from_db, change_order_volume, add_ledger_entry


app = FastAPI()


order_book_map: 'dict[str, dict[str, dict[str, dict[str, OrderBook]]]]' = {} # ex: order_book_map[TOKEN_PAIR][EXPIRY][STRIKE][CALL/PUT]
contract_websockets: 'dict[str, List[WebSocket]]' = defaultdict(list)
event_map: 'dict[str, asyncio.Event]' = defaultdict(asyncio.Event)
new_orders: 'dict[str, List[Order]]' = defaultdict(list)

class Message(BaseModel):
    message: str
    resting: bool = False

class OrderModel(BaseModel):
    orderId: int
    datetime: float
    side: str
    price: float
    volume: int
    client: str

# class Snapshot(BaseModel):
#     best_bid: float
#     bid_volume: int
#     best_ask: float
#     ask_volume: int

class BookView(BaseModel):
    callBSize: int
    callBid: float
    callAsk: float
    callASize: int
    strike: int
    putASize: int
    putAsk: float
    putBid: float
    putBSize: int

# CORS (Cross-Origin Resource Sharing) middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any origin
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Allow these HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.post("/create-orderbook", response_model=Message) 
async def create_orderbook(token_pair: str) -> Message:
    """
    Create an orderbook for the given token pair.

    Args:
        token_pair (str): The token pair for which the orderbook needs to be created.

    Returns:
        dict: A dictionary containing a message indicating whether the orderbook was created or already exists.
    """
    if token_pair not in order_book_map:
        order_book_map[token_pair] = OrderBook()
        return Message(message="Orderbook created.")
    return Message(message="Orderbook already exists.")


# {
# canceled: [orderId, ..., orderId],
# matched: [orderId, …, orderId],
# volumeChanged:[
# 	{orderId, dVolume},
# 	…
# ]
# }
@app.post("/place-order", response_model=Message)
async def place_order(token_pair: str, expiry: str, strike: float, callOrPut: str, order: OrderModel) -> Message:
    """
    Place an order for a given token pair.

    Args:
        token_pair (str): The token pair for which the order is being placed.
        expiry (str): The expiry date of the order.
        strike (float): The strike price of the order.
        order (Order): The order to be placed.


    Returns:
        dict: A dictionary containing a message indicating the success or failure of the order placement.
    """
    try:
        # Check if the order book exists, if not create it
        if token_pair not in order_book_map or expiry not in order_book_map[token_pair] or strike not in order_book_map[token_pair][expiry]:
            order_book_map[token_pair][expiry][strike]['call'] = OrderBook()
            order_book_map[token_pair][expiry][strike]['put'] = OrderBook()
        # Place the order
        order = Order(callOrPut=order.callOrPut, orderId=order.orderId, time=order.datetime, bidOrAsk=order.side, price=order.price, volume=order.volume, client=order.client)
        msg = order_book_map[token_pair][expiry][strike][callOrPut].placeOrder(order)
        # if order is resting and was not matched with any other order, add it to the database
        if msg.resting and msg.matched == []:
            add_to_db(order, strike, expiry, token_pair)
        # otherwise, update the database with the changes in the orderbook
        else:
            for cancelled_order in msg.canceled:
                remove_from_db(cancelled_order.orderId, strike, expiry, token_pair)
            for vol_change in msg.volumeChanged:
                change_order_volume(vol_change.dVolume, vol_change.orderId, strike, expiry, token_pair)
            if msg.resting:
                add_to_db(order, strike, expiry, token_pair)
        add_ledger_entry(order, token_pair, expiry, strike, msg.matched)
        return Message(message="Order placed successfully!",
                           resting=msg.resting)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error placing order: {e}")
        
@app.get('/snapshot', response_model=List[BookView])
def get_snapshot(token_pair: str, expiry: str) -> List[BookView]:
# def get_snapshot(token_pair: str, expiry: str, strike: float) -> List[Snapshot]:
    """
    Get the order book snapshot for a given token pair.

    Args:
        token_pair (str): The token pair for which the order book snapshot is requested.
        expiry (str): The expiry date of the order book.
        strike (float): The strike price of the order book.

    Returns:
        dict: A dictionary containing the order book snapshot.
    """
    try:
        output = []
        for strike in order_book_map[token_pair][expiry]:
            call_snap_dict = order_book_map[token_pair][expiry][strike]['call'].snapshot()
            put_snap_dict = order_book_map[token_pair][expiry][strike]['put'].snapshot()
            output.append(BookView(callBSize=call_snap_dict['bid_volume'], 
                                    callBid=call_snap_dict['best_bid'], 
                                    callAsk=call_snap_dict['best_ask'], 
                                    callASize=call_snap_dict['ask_volume'], 
                                    strike=strike, 
                                    putASize=put_snap_dict['ask_volume'], 
                                    putAsk=put_snap_dict['best_ask'], 
                                    putBid=put_snap_dict['best_bid'], 
                                    putBSize=put_snap_dict['bid_volume']))
        return output.sort(key=lambda x: x.strike)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error getting snapshot: {e}")


# @app.websocket("/order-data/{token_pair}") 
# async def options_contract_websocket(websocket: WebSocket, token_pair: str): 
#     """
#     WebSocket endpoint for handling options contract data.

#     Args:
#         websocket (WebSocket): The WebSocket connection.
#         token_pair (str): The token pair for which the data is requested.

#     Returns:
#         None

#     Raises:
#         Exception: If there is a disconnection or error.

#     """
#     await websocket.accept()
#     contract_websockets[token_pair].append(websocket)
#     try:
#         while True:
#             await event_map[token_pair].wait()
#             for order in new_orders[token_pair]:
#                 await websocket.send_json(order)
#             event_map[token_pair].clear()
#     except Exception as e:
#         # Handle disconnection or error
#         contract_websockets[token_pair].remove(websocket)
#         print(f"Websocket disconnected: {e}")
#     finally:
#         # Make sure to clean up on disconnect
#         if websocket in contract_websockets[token_pair]:
#             contract_websockets[token_pair].remove(websocket)
