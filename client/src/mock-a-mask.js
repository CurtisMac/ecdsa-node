import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

async function mockAMask(address, transactionData) {
  const privateKey = window.prompt(
    "Welcome to mock-a-mask!\nPlease enter your private key:"
  );

  if (privateKey === null || privateKey.trim() === "") {
    throw new Error("Aborting, did not provide a valid key");
  }

  const publicKey = toHex(secp256k1.getPublicKey(privateKey));

  if (publicKey !== address) {
    throw new Error("Private key does not match the wallet id");
  }

  const signature = await signMessage(transactionData, privateKey);

  return signature;
}

async function signMessage(message, privateKey) {
  const hash = keccak256(utf8ToBytes(JSON.stringify(message)));
  return secp256k1.sign(hash, privateKey);
}

export default mockAMask;
