import { Wallet, HDNodeWallet } from 'ethers';
import { WalletInfo } from '../models/Account';
import { AccountInfo } from '../models/Account';

export const generateWallet = (seedPhrase?: string): WalletInfo => {
    let wallet: HDNodeWallet;

    if (seedPhrase) {
        // Use the provided seed phrase to create an HDNode wallet
        wallet = Wallet.fromPhrase(seedPhrase);
    } else {
        // Generate a random wallet and extract the mnemonic
        wallet = Wallet.createRandom();
    }

    // Extract the mnemonic phrase from the wallet
    const mnemonic = wallet.mnemonic?.phrase || '';

    // Extract the private key and address from the wallet
    const privateKey = wallet.privateKey;
    const address = wallet.address;

    // Set a default balance (e.g., 0)
    const balance = '0';

    return {
        seedPhrase: mnemonic,
        privateKey: privateKey,
        address: address,
        balance: balance,
    };
};

export const recoverWallet = (seedPhrase: string): WalletInfo => {
    // Use the provided seed phrase to create an HDNode wallet
    const wallet = Wallet.fromPhrase(seedPhrase);

    // Extract the mnemonic phrase from the wallet
    const mnemonic = wallet.mnemonic?.phrase || '';

    // Extract the private key and address from the wallet
    const privateKey = wallet.privateKey;
    const address = wallet.address;

    // Set a default balance (e.g., 0)
    const balance = '0';

    return {
        seedPhrase: mnemonic,
        privateKey: privateKey,
        address: address,
        balance: balance,
    };
};

export const toFixedIfNecessary = ( value: string, decimalPlaces: number =2 ) => {
    return +parseFloat(value).toFixed( decimalPlaces );
};

export const shortenAddress = (str: string, numChars: number=4) => {
    return `${str.substring(0, numChars)}...${str.substring(str.length - numChars)}`;
};