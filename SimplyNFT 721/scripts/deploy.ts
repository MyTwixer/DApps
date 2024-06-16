import { ethers } from "hardhat";

async function main() {

  const simplyNFT = await ethers.deployContract("SimplyToken", ['0xbffa4029D29F5b0A659196972082dfe17e569937']);

  await simplyNFT.waitForDeployment();
  
  console.log(`Address: ${simplyNFT.target}`)
  
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
