import { ethers, TransactionReceipt, Wallet, TransactionResponse } from 'ethers';
import { CHAINS_CONFIG, sepolia } from '../models/Chain';

export async function sendToken(
  amount: number,
  from: string,
  to: string,
  privateKey: string
): Promise<{ transaction: TransactionResponse; receipt: TransactionReceipt }> {
  const chain = CHAINS_CONFIG[sepolia.chainId];
  const provider = new ethers.JsonRpcProvider(chain.rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  const tx = {
    to,
    value: ethers.parseEther(amount.toString()),
  };

  try {
    const transaction: TransactionResponse = await wallet.sendTransaction(tx);
    const receipt: TransactionReceipt | null = await transaction.wait();

    if (receipt && receipt.status === 1) {
      return { transaction, receipt };
    } else {
      throw new Error(`Transaction failed: ${JSON.stringify(receipt)}`);
    }
  } catch (error: any) {
    console.error("Error sending transaction:", error);
    throw new Error(`Error sending transaction: ${error.message || JSON.stringify(error)}`);
  }
}
