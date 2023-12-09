import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [nonce, setNonce] = useState(0);

  return (
    <div className="app">
      <Wallet
        address={address}
        balance={balance}
        setAddress={setAddress}
        setBalance={setBalance}
        setNonce={setNonce}
      />
      <Transfer
        address={address}
        nonce={nonce}
        setBalance={setBalance}
        setNonce={setNonce}
      />
    </div>
  );
}

export default App;
