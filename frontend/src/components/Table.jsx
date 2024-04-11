import { deleteDoc } from 'firebase/firestore'
import React from 'react'
import * as firebase from '../services/firebase';

// import puts from '../assets/puts.json';




const Table = (props) => {

  const { auth, db } = firebase
  const { bids } = props 



  return (
    <div className="overflow-y-auto w-full h-[256px]">
        <table className="table-auto w-full justify-between">
        <thead className="">
            <tr className="">
                <th className="underline">Open</th>
                <th className="underline">Δ|Delta</th>
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
                <th className="underline">Δ|Delta</th>
                <th className="underline">Open</th>
            </tr>
        </thead>
            <tbody>
                {puts.puts && puts.puts.map((put, i) => {
                    return (
                        <tr key={i} className="">
                            <td className="text-center">{" "}</td>
                            <td className="text-center">{" "}</td>
                            <td className="text-center">{" "}</td>
                            <td className="text-center">{" "}</td>
                            <td className="text-center">{" "}</td>
                            <td className="text-center">{" "}</td>
                            <td className="text-center">{" "}</td>
                            <td className="text-center">{" "}</td>
                            <td className="text-center">{" "}</td>
                            <td className="text-center">{put.strike}</td>
                            <td className="text-center">{put.size}</td>
                            <td className="text-center">{put.ivAsk}</td>
                            <td className="text-center">{put.ask}</td>
                            <td className="text-center">{put.mark}</td>
                            <td className="text-center">{put.bid}</td>
                            <td className="text-center">{put.ivBid}</td>
                            <td className="text-center">{put.size}</td>
                            <td className="text-center">{put.delta}</td>
                            <td className="text-center">{put.open}</td>
                        </tr>
                    )
                })}
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
            </tbody>
        </table>
    </div>
  )
}

export default Table