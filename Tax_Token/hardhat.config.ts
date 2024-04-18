import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import dotenv from 'dotenv'; 
dotenv.config();  

const privateKey = "" + process.env.PRIVATE_KEY;

const config: HardhatUserConfig = {
  defaultNetwork: "sepolia",
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url : process.env.URI,
      accounts: [privateKey],

    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY
  },
  sourcify: {
    enabled: true,
  }
};

export default config;
