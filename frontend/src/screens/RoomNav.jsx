import React from 'react'
import { Room } from '.';
import { useState } from 'react';
import { TradingRoom } from '.';


function RoomNav() {

    const [roomDoc, setRoomDoc] = useState('');

    return (
        <div className="App">
            {(roomDoc === '') ? 
            <TradingRoom 
                roomDoc={roomDoc}
                setRoomDoc={setRoomDoc}
            /> : 
            <Room
                roomDoc={roomDoc}
                setRoomDoc={setRoomDoc}
            /> }
        </div>
    );
  }


export default RoomNav