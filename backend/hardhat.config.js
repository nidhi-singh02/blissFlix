require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

// Go to https://infura.io, sign up, create a new API key
// in its dashboard, and replace "KEY" with it
const INFURA_API_KEY = "KEY";
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;
const API_URL = process.env.API_URL;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: API_URL,
      accounts: [SEPOLIA_PRIVATE_KEY]
    },
    scroll: {
      url: process.env.SCROLL_API_URL,
      accounts: [SEPOLIA_PRIVATE_KEY]
    }
  }
};
