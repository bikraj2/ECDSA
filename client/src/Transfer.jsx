import { useState } from 'react';
import server from './server';
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { toHex, utf8ToBytes } from 'ethereum-cryptography/utils';
import Snackbar from 'awesome-snackbar';
function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const bytes = utf8ToBytes(sendAmount);
      const hash = keccak256(bytes);
      const hexHash = toHex(hash);

      const signature = secp256k1.sign(hexHash, privateKey);
      console.log(signature.r);
      const {
        data: { balance },
      } = await server.post(`send`, {
        signature: {
          hash: hexHash,
          r: `${signature.r}`,
          s: `${signature.s}`,
          bit: `${signature.recovery}`,
        },
        recipient,
        amount: sendAmount,
      });
      setBalance(balance);
    } catch (ex) {
      console.log(ex);
      new Snackbar(`${ex} <a class='bold'>Try Again!</a>`, {
        position: 'bottom-center',
        style: {
          container: [
            ['background-color', 'red'],
            ['border-radius', '5px'],
          ],
          message: [['color', '#eee']],
          bold: [['font-weight', 'bold']],
          actionButton: [['color', 'white']],
        },
      });
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
