import React,{useState,useEffect, Children} from "react";
import {useRouter} from "next/router";

// INTERNAL IMPORT
import { CheckIfWalletConnected,connectWallet,connectingWithContract } from "../Utils/apiFeature";


// CREATING CONTEXT
export const ChatAppContext= React.createContext();

export const ChatAppProvider=({children})=>{
  const title="Hey welcome to chat app";

  return(
    <ChatAppContext.Provider value={{title}}>
      {children}
    </ChatAppContext.Provider>
  )
}