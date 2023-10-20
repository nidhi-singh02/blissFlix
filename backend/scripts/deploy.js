// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const zkyc = await ethers.deployContract("ZKYCVerified",["0x2546BcD3c84621e976D8185a91A922aE77ECEc30"],deployer);
  console.log("zkyc contract is deployed to address:", await zkyc.getAddress());

  const erc20 = await ethers.deployContract("SimpleERC20",["ApeCoin", "APE"],deployer);
  erc20Address =  await erc20.getAddress()
  console.log("erc20 contract is deployed to address:",erc20Address);

  const content = await ethers.deployContract("Content",[erc20Address],deployer);
  contentAddress =  await content.getAddress()
  console.log("content contract is deployed to address:",contentAddress);
  
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


