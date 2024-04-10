// import { FirebaseError } from '@firebase/util'
import React from 'react'
import { FcGoogle } from 'react-icons/fc';
import Typewriter from "typewriter-effect";
import { signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";
import LoginButton from '../components/LoginButton';

const SignIn = () => {

    const auth = getAuth()

    function signInWithGoogle(auth) {
      const provider = new GoogleAuthProvider();
      signInWithRedirect(auth, provider)
    }
  
    return (
      <div className="flex flex-col items-center w-full h-screen bg-gradient-to-r from-violet-400 to-fuchsia-300 justify-center">
        <div className='bg-white flex flex-col items-center p-24 md:px-80 md:py-32 rounded-3xl'>
          <h1 className="text-6xl text-slate-800 font-bold mt-[20%]">
            <Typewriter
              onInit={(typewriter)=> {
    
              typewriter
              
              .typeString("Welcome to the Nibiru Options Marketplace!")
                
              .pauseFor(1000)
              .deleteAll()
              .typeString("Sign in to get started.")
              .start();
              }}
            />
          </h1>
          <LoginButton />
        </div>
        {/* <button 
            onClick={() => signInWithGoogle(auth)} 
            className="flex flex-row items-center bg-white rounded-[20px] p-4 mt-20"
            >
            <FcGoogle
                className="mr-4"
            />
            <p className="text-black"> 
                Sign in with Google!
            </p>    
        </button> */}
      </div>
    )
  }

export default SignIn