import { useState } from "react";

const useMetaMask = () => {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("MetaMask not detected!");
      return null;
    }

    try {
      const accounts = await window.ethereum.request({ 
        method: "eth_requestAccounts" 
      });
      const address = accounts[0];
      setAccount(address);
      setError(null);
      return address;
    } catch (err) {
      setError(err.message);
      console.error("MetaMask connection failed:", err);
      return null;
    }
  };

  return { account, error, connectWallet };
};

export default useMetaMask;