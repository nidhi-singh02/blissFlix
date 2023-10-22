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
  // 0x2546BcD3c84621e976D8185a91A922aE77ECEc30
  
  // const erc20 = await ethers.deployContract("SimpleERC20",["ApeCoin", "APE"],deployer);
  // const erc20Address =  await erc20.getAddress()
  // console.log("erc20 contract is deployed to address:",erc20Address);

  // // const content = await ethers.deployContract("Content",["0xF91c001D4a689BAff2a771032c4A6F186E21C3a7"],deployer);
  // const content = await ethers.deployContract("Content",[erc20Address],deployer);
  // contentAddress =  await content.getAddress()
  // console.log("content contract is deployed to address:",contentAddress);

// const private_key = process.env.PRIVATE_KEY;
// const wallet = new ethers.Wallet(private_key, ethers.provider)

// const ZKYCVerified = await ethers.getContractFactory('ZKYCVerified', wallet);
// console.log('Deploying ZKYCVerified...');
// const dc = await ZKYCVerified.deploy("0xBA27B8078E7dBAb5d4A850dF1d66925Ebd9BD92D");
// await dc.deployed()

  //Convert Ethereum address to f4 address
  // const f4Address = fa.newDelegatedEthAddress("0xA72447714BF764Ef28Bc21F1C7597D178Bf11d36").toString();
  // // console.log('DealClient deployed to:', dc.address);
  // console.log('f4Address:', f4Address);
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});



