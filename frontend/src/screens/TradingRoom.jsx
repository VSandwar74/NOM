import React from 'react'

// import Header from '../components/Header';
// import Title from '../components/Title';
// import Form from '../components/Form';
// import Table from '../components/Table';

import ledger from '../assets/ledger.json';
import bids from '../assets/orders.json';

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

const TradingRoom = ( props ) => {

    const { roomDoc } = props;
    const {db} = firebase
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
          Options Chain
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
                const tableStyle = "text-slate-700 border-y-[0px] border-slate-400 text-center";
                let color = i % 2 == 0 ? 'bg-purple-50' : 'bg-white';
                let bidColor = 'text-green-500';
                let askColor = 'text-red-500';
                return (
                  <tr key={i} className={`${color} h-12`}>
                    <td className={tableStyle}>{option.callopen}</td>
                    <td className={tableStyle}>{option.calldelta}</td>
                    <td className={tableStyle}>{option.callsize}</td>
                    <td className={tableStyle}>{option.callivBid}</td>
                    <td className={`${tableStyle} ${bidColor}`}>{option.callbid}</td>
                    <td className={tableStyle}>{option.callmark}</td>
                    <td className={`${tableStyle} ${askColor}`}>{option.callask}</td>
                    <td className={tableStyle}>{option.callivAsk}</td>
                    <td className={tableStyle}>{option.callsize}</td>
                    <td className={`bg- font-bold text-slate-700 text-center`}>{option.strike}</td>
                    <td className={tableStyle}>{option.putsize}</td>
                    <td className={tableStyle}>{option.putivAsk}</td>
                    <td className={`${tableStyle} ${askColor}`}>{option.putask}</td>
                    <td className={tableStyle}>{option.putmark}</td>
                    <td className={`${tableStyle} ${bidColor}`}>{option.putbid}</td>
                    <td className={tableStyle}>{option.putivBid}</td>
                    <td className={tableStyle}>{option.putsize}</td>
                    <td className={tableStyle}>{option.putdelta}</td>
                    <td className={tableStyle}>{option.putopen}</td>
                  </tr>
                );
              })}
            </tbody>
                {/* {bids && bids.map((order, i) => {
                    // const myOrder = order.uid == auth.currentUser.uid
                    const isBid = order.bidOrAsk == 'bid'
                    if (isBid) {
                    return (
                        <tr key={i} className="">
                            {/* {(myOrder) ? 
                                (<td 
                                    className="text-center cursor-pointer hover:text-red-500"
                                    // onClick={() => (deleteDoc(order.ref))}
                                    >
                                    x
                                </td>) : 
                                (<td className="text-center"></td>)} 
                            <td className="text-center"></td>
                            <td className="text-center">{order.name}</td>
                            <td className="text-center">{order.bidOrAsk}</td>
                            <td className="text-center">{order.value}</td>
                            <td className="text-center">{" "}</td>
                            <td className="text-center">{" "}</td>
                            <td className="text-center">{" "}</td>
                        </tr>
                    )
                    } else {
                    return (
                        <tr key={i} className="">
                            <td className="text-center"></td>
                            <td className="text-center"></td>
                            <td className="text-center"></td>
                            <td className="text-center">{order.value}</td>
                            <td className="text-center">{order.bidOrAsk}</td>
                            <td className="text-center">{order.name}</td>
                            <td className="text-center"></td>
                            {{(myOrder) ? 
                                (<td 
                                    className="text-center cursor-pointer hover:text-red-500"
                                    // onClick={() => (deleteDoc(order.ref))}
                                    >
                                    x
                                </td>) : 
                                (<td className="text-center"></td>)} 
                        </tr>
                    )
                    }
                })} */}
          </table>
        </div>
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