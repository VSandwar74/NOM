from starlette.websockets import WebSocket
from typing import Dict
import json


"""
Websocket code.
Has functions for connecting, sending, receiving, disconnecting. 

Still need to:
- add specific implementation for receiving messages
- figure out how we want to use these websockets and adjust accordingly
- how we want messages to be sent back and forth (eg. json, str, etc)
"""

class WebsocketManager:
    def __init__(self):
        self.connections: Dict[str, list[WebSocket]] = {}

    async def connect(self, group_id: str, websocket: WebSocket):
        #accept websocket connection
        await websocket.accept()

        #add websocket to connections group
        if group_id not in self.connections:
            self.connections[group_id] = []
        self.connections[group_id].append(websocket)

        print(f'Websocket connection established in group {group_id}.')

    #disconnect
    async def disconnect(self, group_id: str, websocket: WebSocket):
        if group_id in self.connections:
            if websocket in self.connections[group_id]:
                await websocket.close()
                self.connections[group_id].remove(websocket)
                print(f'Websocket connection closed from group {group_id}')
            if len(self.connections[group_id]) == 0:
                del self.connections[group_id]

    #methods for sending one message. text, byte, json, and raw ASGI data. we can delete as we need to later.
    async def send_personal_text(self, message: str, group_id: str, websocket: WebSocket):
        if group_id in self.connections:
            if websocket in self.connections[group_id]:
                await websocket.send_text(message)
                print(f'String message sent to one user.')

    async def send_personal_bytes(self, message: str, group_id: str, websocket: WebSocket):
        if group_id in self.connections:
            if websocket in self.connections[group_id]:
                await websocket.send_bytes(bytes(message))
                print(f'Byte message sent to one user.')

    async def send_personal_json(self, message: json, group_id: str, websocket: WebSocket):
        if group_id in self.connections:
            if websocket in self.connections[group_id]:
                await websocket.send_json(json.dumps(message))
                print(f'JSON message sent to one user.')

    async def send_raw_asgi_data(self, message: str, group_id: str, websocket: WebSocket):
        if group_id in self.connections:
            if websocket in self.connections[group_id]:
                await websocket.send(message)
                print(f'Message sent to one user.')

    #sending messages for every websocket.
    async def broadcast_text(self, message: str, group_id: str):
        if group_id in self.connections:
            for websocket in self.connections[group_id]:
                await websocket.send_text(message)
                print(f'Message from {group_id} {websocket} sent.')

    async def broadcast_bytes(self, message: str, group_id: str):
        if group_id in self.connections:
            for websocket in self.connections[group_id]:
                await websocket.send_bytes(bytes(message))
                print(f'Message from {group_id} {websocket} sent.')

    async def broadcast_json(self, message: json, group_id: str):
        if group_id in self.connections:
            for websocket in self.connections[group_id]:
                await websocket.send_bytes(json.dumps(message))
                print(f'Message from {group_id} {websocket} sent.')

    async def broadcast_raw_asgi_data(self, message: str, group_id: str):
        if group_id in self.connections:
            for websocket in self.connections[group_id]:
                await websocket.send(message)
                print(f'Message from {group_id} {websocket} sent.')

    #receiving messages from frontend
    async def receive(self, websocket: WebSocket):
        message = await websocket.receive_text()

        message_data = json.loads(message)

        #if the message sent is a heartbeat msg to keep websocket alive
        if message_data['message_type'] == 'heartbeat':
            return
        else:
            pass
            #we will add the rest when we know what to add (or add it in API endpoints)
