import React from 'react'

// import Header from '../components/Header';
// import Title from '../components/Title';
// import Form from '../components/Form';
// import Table from '../components/Table';

import positions from '../assets/positions.json';
import { Modal } from 'react-responsive-modal';

// Header
import logo from '../assets/logo.png'
import LogoutButton from '../components/LogoutButton';

import {
  Header,
  Title,
  Form,
  Table
} from '../components';

import { useState, useEffect } from 'react'
import { collection, query, onSnapshot, orderBy, where, limit } from "firebase/firestore";
import * as firebase from '../services/firebase';
import { useParams } from 'react-router-dom';
import Ledger from '../components/Ledger';

import options from '../assets/options.json';

const closeIcon = (
  <svg fill="currentColor" viewBox="0 0 20 20" width={28} height={28}>
    <path
      fillRule="evenodd"
      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
      clipRule="evenodd"
    ></path>
  </svg>
);

const TradingRoom = ( props ) => {

    const { roomDoc } = props;
    const {db} = firebase
    const [open, setOpen] = useState(false);
    // const [bids, setBids] = useState([])
    // const [ledger, setLedger] = useState([])

    // useEffect(() => {
    //   const orderQuery = query(collection(db, "rooms", roomDoc.ref.id ,"orders"), where('bidOrAsk', 'in', ['bid', 'ask']), orderBy('value', 'asc'), orderBy('timestamp', 'asc'));
    //   const unsubscribe = onSnapshot(orderQuery, (querySnapshot) => {
    //     const trades = [];
    //     querySnapshot.forEach((doc) => {
    //         trades.push({
    //           ref: doc.ref,
    //           ...doc.data(), 
    //         });
    //     });
    //     setBids(trades)
    //   });
  
    //   return () => {
    //     unsubscribe();
    //   };
    // }, []);

    // useEffect(() => {
    //   const ledgerQuery = query(collection(db, "rooms", roomDoc.ref.id, "ledger"), orderBy('timestamp', 'desc'), limit(5))
    //   const unsub = onSnapshot(ledgerQuery, (querySnapshot) => {
    //     const tx = [];
    //     querySnapshot.forEach((doc) => {
    //         tx.push({
    //           ref: doc.ref,
    //           ...doc.data(), 
    //         });
    //     });
    //     setLedger(tx)
    //   });
    //   return () => {
    //     unsub();
    //   };
    // }, []);

    // console.log(ledger)
    console.log('fal');
    console.log(roomDoc.name);
    {/* <Header roomId={roomDoc.ref.id} roomName={roomDoc.name} /> */}
    return (
      <div className='flex flex-col items-center w-full bg-gradient-to-r from-violet-400 to-fuchsia-300'>
        <Header />
        <h1 className='font-bold text-2xl self-start ml-[5%] text-white mt-[8vh]'>
          Options Chain ({roomDoc.name})
        </h1>
        <div className='w-[95%] h-full border-slate-400 border-0 bg-white/75 p-3 rounded-3xl mx-[2%] mb-[2%]'>
          <div className='w-full flex flex-row justify-between text-xl text-black font-bold border-b-[1px]'>
            <p/>
            <h2>Calls</h2>
            <h2>date_place</h2>
            <h2>Puts</h2>
            <p/>
          </div>
          <table className="table-auto w-[95%] justify-between mx-auto mt-2 rounded">
            <thead className="text-slate-950 font-semibold">
                <tr className="">
                    <th className="underline">Open</th>
                    <th className="underline">Delta</th>
                    <th className="underline">Size</th>
                    <th className="underline">IV Bid</th>
                    <th className="underline">Bid</th>
                    <th className="underline">Mark</th>
                    <th className="underline">Ask</th>
                    <th className="underline">IV Ask</th>
                    <th className="underline">Size</th>
                    <th className="underline">Strike</th>
                    <th className="underline">Size</th>
                    <th className="underline">IV Ask</th>
                    <th className="underline">Ask</th>
                    <th className="underline">Mark</th>
                    <th className="underline">Bid</th>
                    <th className="underline">IV Bid</th>
                    <th className="underline">Size</th>
                    <th className="underline">Delta</th>
                    <th className="underline">Open</th>
                </tr>
            </thead>
            <tbody className='' >
              {options.options && options.options.map((option, i) => {
                const tableStyle = "border-y-[0px] border-slate-400 text-center";
                let color = i % 2 == 0 ? 'bg-purple-50' : 'bg-white';
                let bidColor = 'text-green-500';
                let askColor = 'text-red-500';
                return (
                  <tr key={i} className={`${color} h-12`}>
                    <td className={`text-slate-700 ${tableStyle}`}>{option.callopen}</td>
                    <td className={`text-slate-700 ${tableStyle}`}>{option.calldelta}</td>
                    <td className={`text-slate-700 ${tableStyle}`}>{option.callsize}</td>
                    <td className={`text-slate-700 ${tableStyle}`}>{option.callivBid}</td>
                    <td className={`${bidColor} ${tableStyle}`}>{option.callbid}</td>
                    <td className={`text-slate-700 ${tableStyle}`}>{option.callmark}</td>
                    <td className={`${askColor} ${tableStyle} `}>{option.callask}</td>
                    <td className={`text-slate-700 ${tableStyle}`}>{option.callivAsk}</td>
                    <td className={`text-slate-700 ${tableStyle}`}>{option.callsize}</td>
                    <td className={`font-bold text-slate-700 text-center`}>{option.strike}</td>
                    <td className={`text-slate-700 ${tableStyle}`}>{option.putsize}</td>
                    <td className={`text-slate-700 ${tableStyle}`}>{option.putivAsk}</td>
                    <td className={`${tableStyle} ${askColor}`}>{option.putask}</td>
                    <td className={`text-slate-700 ${tableStyle}`}>{option.putmark}</td>
                    <td className={`${tableStyle} ${bidColor}`}>{option.putbid}</td>
                    <td className={`text-slate-700 ${tableStyle}`}>{option.putivBid}</td>
                    <td className={`text-slate-700 ${tableStyle}`}>{option.putsize}</td>
                    <td className={`text-slate-700 ${tableStyle}`}>{option.putdelta}</td>
                    <td className={`text-slate-700 ${tableStyle}`}>{option.putopen}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <h1 className='font-bold text-2xl self-start ml-[5%] text-white'>
          Positions
        </h1>
        <div className='w-[95%] h-full border-slate-400 border-0 bg-white/75 p-3 rounded-3xl mx-[2%] mb-[2%]'>
          <table className='table-auto w-[95%] justify-between mx-auto mt-2 rounded'>
            <thead className='text-slate-950 font-semibold'>
              <th className="underline">Instrument</th>
              <th className="underline">Amount</th>
              <th className="underline">Value</th>
              <th className="underline">Avg Price</th>
              <th className="underline">Mark Price</th>
              <th className="underline">PnL</th>
            </thead>
            <tbody className='' >
              {positions && positions.map((position, i) => {
                let color = i % 2 == 0 ? 'bg-purple-50' : 'bg-white';
                return (
                  <tr key={i} className={`${color} h-12`}>
                    <td className={`text-slate-700} text-center`}>{position.instrument}</td>
                    <td className={`text-slate-700 text-center`}>{position.amount}</td>
                    <td className={`text-slate-700 text-center`}>{position.value}</td>
                    <td className={`text-slate-700 text-center`}>{position.avgprice}</td>
                    <td className={`text-slate-700 text-center`}>{position.markprice}</td>
                    <td className={`text-slate-700 text-center`}>{position.pnl}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <h1 className='font-bold text-2xl self-start ml-[5%] text-white'>
          Open Orders
        </h1>
        <div className='w-[95%] h-full border-slate-400 border-0 bg-white/75 p-3 rounded-3xl mx-[2%] mb-[2%]'>
          <button className="px-4 py-2 text-slate-400 bg-white rounded-full" onClick={() => setOpen(true)}>
              Place Trade
          </button>
          
        </div>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          center
          // closeIcon={closeIcon}
          classNames="bg-purple-500"
        >
          <Form tokenPair={roomDoc.name}/>
        </Modal>
        {/* <div className="flex flex-col items-center w-full">
        </div>
        <div className='w-full flex flex-row px-12 justify-center items-center justify-self-center'>
          <div className="w-3/4 h-[512px] flex flex-col rounded-[20px] items-center bg-white/75 mt-10 px-10">
            <Title roomName={roomDoc.name}/>
            <Form bids={bids} roomId="246ytjhh,vl9" tokenPair={roomDoc.name}/>
          <div className='flex flex-row w-full justify-center mt-1'>
            <Table bids={bids}/>
          </div>
        </div>
          <div className='w-1/4'>
            <Ledger ledger={ledger} />
          </div>
      </div>
        <div className="absolute bottom-0 text-white">
            <p>Made by Vishakh Sandwar</p>
        </div> */}
      </div>
    )
  };



export default TradingRoom