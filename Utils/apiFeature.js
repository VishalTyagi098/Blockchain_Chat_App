import {ethers} from "ethers";
import Web3Modal from "web3modal";

import { ChatAppAddress, ChatAppABI } from "../Context/constants";

// Check if we are connected to metamask or not
export const CheckIfWalletConnected = async()=>{
  try{
    if(!window.ethereum) return console.log("Install MetaMask");

    const accounts=await window.ethereum.request({
      method:"eth_accounts",
    })

    const firstAccount=accounts[0];
    return firstAccount;

  }catch(error){
    console.log(error);
  }
}

// Connect to metamask wallet
export const connectWallet =async()=>{
  try{
    if(!window.ethereum) return console.log("Install MetaMask");

    const accounts=await window.ethereum.request({
      method:"eth_requestAccounts",
    })

    const firstAccount=accounts[0];
    return firstAccount;

  }catch(error){
    console.log(error);
  }
}

// fetch contract
const fetchContract=(signerOrProvider)=> new ethers.Contract(ChatAppAddress,ChatAppABI,signerOrProvider);

// connect with contract
export const connectingWithContract=async()=>{
  try{
    const web3modal=new web3Modal();
    const connection =await web3modal.connect();
    const provider=new ethers.providers.Web3Provider(connection);
    const signer=provider.getSigner();
    const contract=fetchContract(signer);

    return contract;
  }catch(error){
    console.log(error);
  }
}

// Returns time that will be displayed in messages
export const convertTime=(time)=>{
  const newTime=new Date(time.toNumber());
  const realTime=newTime.getHours()+"/"+ newTime.getMinutes()+"/"+newTime.getSeconds()+ " Date:"+ newTime.getDate()+ "/" + (newTime.getMonth()+1) + newTime.getFullYear();

  return realTime;
}