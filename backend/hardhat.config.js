require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_API_URL,
      accounts: [PRIVATE_KEY]
    },
    scroll: {
      url: process.env.SCROLL_API_URL,
      accounts: [PRIVATE_KEY]
    },
    filecoin:{
      url : process.env.FILECOIN_API_URL,
      accounts: [PRIVATE_KEY]
    },
    mantle : {
      url : process.env.MANTLE_API_URL,
      accounts : [PRIVATE_KEY]
    },
    goerli: {
      url: process.env.GOERLI_API_URL,
      accounts: [PRIVATE_KEY]
    }
  }
};
