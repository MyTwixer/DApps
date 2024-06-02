import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { sepolia } from '../../models/Chain';
import { AccountInfo } from '../../models/Account';
import AccountTransactions from './AccountTransactions'; 
import { sendToken } from '../../utils/TransactionUtils';
import { toFixedIfNecessary } from '../../utils/AccountUtilis';
import './Account.css';

interface AccountDetailProps {
  account: AccountInfo;
}

const AccountDetail: React.FC<AccountDetailProps> = ({ account }) => {
  const [destinationAddress, setDestinationAddress] = useState('');
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(String(account.balance)); // Ensure balance is a string

  const [networkResponse, setNetworkResponse] = useState<{
    status: null | 'pending' | 'complete' | 'error';
    message: string | React.ReactElement;
  }>({
    status: null,
    message: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(sepolia.rpcUrl);
        let accountBalance = await provider.getBalance(account.address);
        setBalance(String(toFixedIfNecessary(ethers.formatEther(accountBalance))));
      } catch (error) {
        console.error('Error fetching account balance:', error);
      }
    };
    fetchData();
  }, [account.address]);

  function handleDestinationAddressChange(event: React.ChangeEvent<HTMLInputElement>) {
    setDestinationAddress(event.target.value);
  }

  function handleAmountChange(event: React.ChangeEvent<HTMLInputElement>) {
    setAmount(Number.parseFloat(event.target.value));
  }

  async function transfer() {
    setNetworkResponse({
      status: 'pending',
      message: '',
    });

    try {
      const { transaction, receipt } = await sendToken(amount, account.address, destinationAddress, account.privateKey);

      if (receipt && receipt.status === 1) {
        setNetworkResponse({
          status: 'complete',
          message: (
            <p>
              Transfer complete!{' '}
              <a href={`${sepolia.blockExplorerUrl}/tx/${transaction.hash}`} target="_blank" rel="noreferrer">
                View transaction
              </a>
            </p>
          ),
        });
      } else {
        console.log(`Failed to send: ${JSON.stringify(receipt)}`);
        setNetworkResponse({
          status: 'error',
          message: JSON.stringify(receipt),
        });
      }
    } catch (error: any) {
      console.error('Error during transfer:', error);
      setNetworkResponse({
        status: 'error',
        message: error.reason || JSON.stringify(error),
      });
    }
  }

  return (
    <div className="AccountDetail container">
      <h4>
        Address:{' '}
        <a href={`https://sepolia.etherscan.io/address/${account.address}`} target="_blank" rel="noreferrer">
          {account.address}
        </a>
        <br />
        Balance: {balance} ETH
      </h4>

      <div className="form-group">
        <label>Destination Address:</label>
        <input className="form-control" type="text" value={destinationAddress} onChange={handleDestinationAddressChange} />
      </div>

      <div className="form-group">
        <label>Amount:</label>
        <input className="form-control" type="number" value={amount} onChange={handleAmountChange} />
      </div>

      <button className="btn btn-primary" type="button" onClick={transfer} disabled={!amount || networkResponse.status === 'pending'}>
        Send {amount} ETH
      </button>

      {networkResponse.status && (
        <>
          {networkResponse.status === 'pending' && <p>Transfer is pending...</p>}
          {networkResponse.status === 'complete' && <p>{networkResponse.message}</p>}
          {networkResponse.status === 'error' && <p>Error occurred while transferring tokens: {networkResponse.message}</p>}
        </>
      )}

      <AccountTransactions account={account} />
    </div>
  );
};

export default AccountDetail;
