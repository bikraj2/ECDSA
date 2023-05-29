import server from './server';
import * as secp from 'ethereum-cryptography/secp256k1';
import { toHex } from 'ethereum-cryptography/utils';
import Snackbar from 'awesome-snackbar';
function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  async function onChange(evt) {
    try {
      const privateKey = evt.target.value;
      setPrivateKey(privateKey);
      const address = toHex(secp.secp256k1.getPublicKey(privateKey));

      setAddress(address);
      console.log('asdf');
      if (address) {
        const {
          data: { balance },
        } = await server.get(`balance/${address}`);
        setBalance(balance);
      } else {
        setBalance(0);
      }
    } catch (e) {
      if (privateKey.length > 0) {
        new Snackbar(`Incorrect Private Key <a class='bold'>Try Again!</a>`, {
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
  }

  return (
    <div className='container wallet'>
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder='Type a Private Key'
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>
      <div>Adress: {address}</div>
      <div className='balance'>Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
