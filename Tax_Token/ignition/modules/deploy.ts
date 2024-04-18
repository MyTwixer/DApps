import { ethers } from "hardhat";

async function main() {

  const taxToken = await ethers.deployContract("TaxToken");

  await taxToken.waitForDeployment();

  console.log(`Address: ${taxToken.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
