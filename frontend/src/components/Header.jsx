import React from 'react'

import { useState, useEffect } from 'react'
import * as firebase from '../services/firebase';
import logo from '../assets/logo.png'
import LogoutButton from './LogoutButton';
import { doc, onSnapshot, setDoc, } from "firebase/firestore";

const Header = (props) => {
  const { roomId, roomName } = props;

  return (
      <header className='fixed top-0 w-full border-b-slate-400 flex flex-row justify-between bg-white/75 p-2 px-4 items-center h-[8%] border-[2px]'>
        <div className='flex flex-row items-end h-full'>
          <p className='font-bold text-transparent bg-violet-400 bg-gradient-tor from-violet-400 to-fuchsia-300 bg-clip-text text-3xl'>
            NOM
          </p>
        </div>
        <img src={logo} className="h-10 absolute top-2 left-[49%]" alt='NOM logo'/>
        <LogoutButton />
      </header>
  )
}

export default Header