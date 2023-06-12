import React,{useState,useEffect} from "react";
import {useRouter} from "next/router";

// 1. INTERNAL IMPORT
import { CheckIfWalletConnected,connectWallet,connectingWithContract } from "../Utils/apiFeature";


//2. CREATING CONTEXT
export const ChatAppContext= React.createContext();

export const ChatAppProvider=({children})=>{

  //3. STATE VARIABLES
  const [account, setAccount] = useState("");
  const [userName, setUserName] = useState("");
  const [friendLists, setFriendLists] = useState([]);
  const [friendMsg, setFriendMsg] = useState([]);
  const [userLists, setUserLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //4. CHAT USER STATE VARIABLES
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserData, setCurrentUserData] = useState("");

  //5. To redirect user to homepage once they create an account
  const router=useRouter();

  // 6. Fetch data (at the time of page load)
  const fetchData=async()=>{
    try {

      // get contract
      const contract=await connectingWithContract();
      // get user account
      const connectAccount=await connectWallet();
      setAccount(connectAccount);
      // get user name
      const userName=await contract.getUsername(connectAccount);
      setUserName(userName);
      // get user friends list
      const friendLists=await contract.getMyFriendList();
      setFriendLists(friendLists);
      // get all app user lsit
      const userList=await contract.getAllAppUser();
      setUserLists(userList);

    } catch (error) {
      setError("Please install and connect your wallet");
    }
  }

  // 7. Call this fetchData function every time our application loads
  useEffect(() => {
    fetchData();
  
  }, []);
  

  return(
    <ChatAppContext.Provider value={{}}>
      {children}
    </ChatAppContext.Provider>
  )
}