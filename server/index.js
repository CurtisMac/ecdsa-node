const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const accounts = {
  "024435a6cccf799c1eab465646bb5bbf58bc7624db47bfe34b5ffd476136003065": {
    balance: 100,
    nonce: 0,
  },
  "03cb94ccd8bd914464e936db4dc4acba07ba322f0e7284ec4ed85cdb267653e68c": {
    balance: 50,
    nonce: 0,
  },
  "0381a0563f12c398366aaa40a34eb21b5dad55732f28d538da051ea237db390ad6": {
    balance: 75,
    nonce: 0,
  },
};

app.get("/account/:address", (req, res) => {
  const { address } = req.params;
  res.send({
    balance: accounts[address]?.balance || 0,
    nonce: accounts[address]?.nonce || 0,
  });
});

app.post("/send", (req, res) => {
  const { amount, nonce, recipient, sender } = req.body.payload;

  try {
    const signature = JSON.parse(req.body.signature, (key, value) => {
      return key === "s" || key === "r" ? BigInt(value) : value;
    });
    const messageHash = keccak256(
      utf8ToBytes(JSON.stringify({ ...req.body.payload }))
    );
    const isValid = secp256k1.verify(signature, messageHash, sender);

    if (!isValid) {
      throw new Error();
    }
  } catch (error) {
    res.status(403).send({ message: "Signature not valid" });
    return;
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (accounts[sender].balance < amount) {
    res.status(403).send({ message: "Not enough funds!" });
  } else if (nonce <= accounts[sender].nonce) {
    res.status(403).send({ message: "Transaction already processed!" });
  } else {
    accounts[sender].balance -= amount;
    accounts[recipient].balance += amount;
    accounts[sender].nonce = nonce;

    res.send({
      balance: accounts[sender]?.balance,
      nonce: accounts[sender]?.nonce,
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!accounts[address]) {
    accounts[address] = {
      balance: 0,
      nonce: 0,
    };
  }
}
