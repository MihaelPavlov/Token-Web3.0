import { HardhatUserConfig, task } from "hardhat/config";
import "./artifacts/contracts/CarCollection.sol/CarCollection.json";
import "@nomicfoundation/hardhat-toolbox";
require('dotenv').config();

const { INFURA_URL_GOERLI, INFURA_URL_SEPOLIA, PRIVATE_KEY, ETHERSCAN_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: INFURA_URL_GOERLI,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    sepolia: {
      url: INFURA_URL_SEPOLIA,
      accounts: [`0x${PRIVATE_KEY}`],
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at <https://etherscan.io/>
    apiKey: ETHERSCAN_KEY
  }
};
export default config;
