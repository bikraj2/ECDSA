import { useState } from 'react';
import server from './server';
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { utf8ToBytes } from 'ethereum-cryptography/utils';
function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    const bytes = utf8ToBytes(sendAmount);
    const hash = keccak256(bytes);
    const signature = secp256k1.sign(hash, privateKey);
    console.log(signature.r);
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        signature: {
          hash: hash,
          r: `${signature.r}`,
          s: `${signature.r}`,
          bit: `${signature.recovery}`,
        },
        recipient,
      });
      setBalance(balance);
    } catch (ex) {
      console.log(ex);
    }
  }

  return (
    <form className='container transfer' onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder='1, 2, 3...'
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder='Type an address, for example: 0x2'
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type='submit' className='button' value='Transfer' />
    </form>
  );
}

export default Transfer;
