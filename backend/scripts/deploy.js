// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const fa = require("@glif/filecoin-address");

async function main() {

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  const zkyc = await ethers.deployContract("ZKYCVerified",["0xBA27B8078E7dBAb5d4A850dF1d66925Ebd9BD92D"],deployer);
  console.log("zkyc contract is deployed to address:", await zkyc.getAddress());

  const erc20 = await ethers.deployContract("SimpleERC20",["ApeCoin", "APE"],deployer);
  const erc20Address =  await erc20.getAddress()
  console.log("erc20 contract is deployed to address:",erc20Address);

  // const content = await ethers.deployContract("Content",["0xF91c001D4a689BAff2a771032c4A6F186E21C3a7"],deployer);
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



