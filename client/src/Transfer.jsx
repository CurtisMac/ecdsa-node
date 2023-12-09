import { useRef, useState } from "react";
import server from "./server";
import mockAMask from "./mock-a-mask";

function Transfer({ address, nonce, setBalance, setNonce }) {
  const [recipient, setRecipient] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [signature, setSignature] = useState("");

  const setValue = (setter) => (evt) => {
    setSignature("");
    setter(evt.target.value);
  };

  let payload = useRef({});

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance, nonce },
      } = await server.post(`send`, {
        payload: payload.current,
        signature: JSON.stringify(signature, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        ),
      });
      setBalance(balance);
      setNonce(nonce);
      setSignature("");
      setSendAmount("");
      setRecipient("");
      payload.current = {};
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  async function signTransaction() {
    try {
      payload.current = {
        amount: parseInt(sendAmount),
        nonce: nonce + 1,
        recipient,
        sender: address,
      };
      const signature = await mockAMask(address, payload.current);
      setSignature(signature);
    } catch (error) {
      alert("Unable to sign transaction");
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input
        type="button"
        className="button"
        value="Sign transaction"
        onClick={signTransaction}
        disabled={!recipient || !sendAmount || signature}
      />
      <input
        type="submit"
        className="button"
        value="Transfer"
        disabled={signature === ""}
      />
    </form>
  );
}

export default Transfer;
