from starlette.websockets import WebSocket
from typing import Dict, List


class WebsocketManager:
    def __init__(self):
        self.connections: Dict[str, list[WebSocket]] = {}


    async def connect(self, group_id: str, websocket: WebSocket):
        

