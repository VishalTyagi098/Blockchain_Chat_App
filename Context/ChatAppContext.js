import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

// 1. INTERNAL IMPORT
import {
  CheckIfWalletConnected,
  connectWallet,
  connectingWithContract,
} from "../Utils/apiFeature";

//2. CREATING CONTEXT
export const ChatAppContext = React.createContext();

export const ChatAppProvider = ({ children }) => {
  //3. STATE VARIABLES
  const [account, setAccount] = useState("");
  const [userName, setUserName] = useState("");
  const [friendLists, setFriendLists] = useState([]);
  const [friendMsg, setFriendMsg] = useState([]);
  const [userLists, setUserLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //4. CHAT USER STATE VARIABLES (of the person we're chatting with)
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserAddress, setCurrentUserAddress] = useState("");

  //5. To redirect user to homepage once they create an account
  const router = useRouter();

  // 6. Fetch data (at the time of page load)
  const fetchData = async () => {
    try {
      // get contract
      const contract = await connectingWithContract();
      // get user account
      const connectAccount = await connectWallet();
      setAccount(connectAccount);
      // get user name
      const userName = await contract.getUsername(connectAccount);
      setUserName(userName);
      // get user friends list
      const friendLists = await contract.getMyFriendList();
      setFriendLists(friendLists);
      // get all app user lsit
      const userList = await contract.getAllAppUser();
      setUserLists(userList);
    } catch (error) {
      setError("Please install and connect your wallet");
    }
  };

  // 7. Call this fetchData function every time our application loads
  useEffect(() => {
    fetchData();
  }, []);

  // 8. READ MESSAGE
  const readMessage = async (friendAddress) => {
    try {
      const contract = await connectingWithContract();
      const read = await contract.readMessage(friendAddress);
      setFriendMsg(read);
    } catch (error) {
      setError("Currently you have no messages");
    }
  };

  // 9. CREATE ACCOUNT
  const createAccount = async ({ Name, accountAddress }) => {
    try {
      if (Name || accountAddress) {
        return setError("Name and AccountAddress cannot be empty");
      }

      const contract = await connectingWithContract();
      const getCreatedUser = await contract.createAccount(Name);

      // this process will take time so we set loading to true
      setLoading(true);
      await getCreatedUser.wait();
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setError("Error while creating your account. Please reload browser");
    }
  };

  // 10. ADD YOUR FRIENDS
  const addFriends = async ({ Name, accountAddress }) => {
    try {
      if (Name || accountAddress) {
        return setError("Please provide data.");
      }

      const contract = await connectingWithContract();
      const addMyFriend = await contract.addFriend(accountAddress, Name);

      // this process will take time, so we use loading
      setLoading(true);
      await addMyFriend.wait();
      setLoading(false);
      router.push("/");
      window.location.reload();
    } catch (error) {
      setError("Something went wrong while adding friends, try again.");
    }
  };

  // 11. SEND MESSAGE
  const sendMessage = async ({ msg, address }) => {
    try {
      if (msg || address) {
        return setError("Please type your message.");
      }

      const contract = await connectingWithContract();
      const addMessage = await contract.sendMessage(address, msg);

      // it will take time so we use loading
      setLoading(true);
      await addMessage.wait();
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setError("Please reload and try again.");
    }
  };

  // 12. READ USER INFORMATION (of the person we're chatting with)
  const readUser = async (userAddress) => {
    const contract = await connectingWithContract();
    const userName = await contract.getUsername(userAddress);
    setCurrentUserName(userName);
    setCurrentUserAddress(userAddress);
  };

  return (
    <ChatAppContext.Provider
      value={{
        readMessage,
        createAccount,
        addFriends,
        sendMessage,
        readUser,
        connectWallet,
        CheckIfWalletConnected,
        account,
        userName,
        friendLists,
        friendMsg,
        userLists,
        loading,
        error,
        currentUserName,
        currentUserAddress
      }}
    >
      {children}
    </ChatAppContext.Provider>
  );
};
