const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const secp = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');
app.use(cors());
app.use(express.json());

const balances = {
  '03c06a8a9bbb694ffd679cb8ff3271a41265e72b4c340631817b1815df3eaf025a': 100,
  '02b1f827adfe517543ff5230243f19f04b66de1a6ebc4c75eba113569ea406ed69': 50,
  '029977497a3c651fc7657b992ebec7a465143d6935d2856cb0d24c51e270faed59': 75,
};

app.get('/balance/:address', (req, res) => {
  const { address } = req.params;

  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  try {
    const {
      signature: { hash, s, bit, r },
      recipient,
      amount,
    } = req.body;
    // const value = new Uint8Array(hash);
    // console.log(value);
    // const getHex = toHex(value);
    const signatureInstance = new secp.secp256k1.Signature(
      BigInt(r),
      BigInt(s),
      parseInt(bit)
    );

    const publicKey = signatureInstance.recoverPublicKey(hash).toHex();
    setInitialBalance(publicKey);
    setInitialBalance(recipient);

    if (balances[publicKey] < amount) {
      res.status(400).send({ message: 'Not enough funds!' });
    } else {
      balances[publicKey] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[publicKey] });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
