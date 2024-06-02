import React, { useState } from 'react';
import { generateWallet, recoverWallet } from '../../utils/AccountUtilis';
import 'bootstrap/dist/css/bootstrap.min.css';
import { WalletInfo } from '../../models/Account';
import AccountDetails from './AccountDetail';

const AccountCreate: React.FC = () => {
    const [showInput, setShowInput] = useState(false);
    const [seedPhrase, setSeedPhrase] = useState('');
    const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);

    const handleButtonClick = () => {
        setShowInput(true);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSeedPhrase(event.target.value);
    };

    const handleRecoverWallet = () => {
        const recoveredWallet = recoverWallet(seedPhrase);
        setWalletInfo(recoveredWallet);
    };

    const createAccount = () => {
        const randomWalletInfo = generateWallet();
        console.log('Random Wallet - Seed Phrase:', randomWalletInfo.seedPhrase);
        console.log('Random Wallet - Private Key:', randomWalletInfo.privateKey);
        console.log('Random Wallet - Address:', randomWalletInfo.address);
        setWalletInfo(randomWalletInfo);
        console.log('Account created!');
    };

    return (
        <div className="container mt-5 p-5 card shadow">
            <button className="btn btn-primary mb-3" onClick={createAccount}>Create Account</button>

            <div>
                <button className="btn btn-secondary mb-3" onClick={handleButtonClick}>Recover Wallet</button>
                {showInput && (
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control mb-2"
                            value={seedPhrase}
                            onChange={handleInputChange}
                            placeholder="Enter seed phrase"
                        />
                        <button className="btn btn-success" onClick={handleRecoverWallet}>Submit</button>
                    </div>
                )}
                {walletInfo && (
                    <div className="card mt-3">
                        <div className="card-body">
                            <AccountDetails account={walletInfo} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountCreate;