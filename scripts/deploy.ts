import { ethers } from "hardhat";

async function main() {
  console.log("Deploying Raw Materials Trading contract...");

  // Get the contract factory
  const RawMaterialsTrading = await ethers.getContractFactory("RawMaterialsTrading");

  // Deploy the contract
  const contract = await RawMaterialsTrading.deploy();

  // Wait for deployment to complete
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();

  console.log("Raw Materials Trading contract deployed to:", contractAddress);
  console.log("Transaction hash:", contract.deploymentTransaction()?.hash);

  // Verify the deployment
  console.log("Verifying deployment...");
  const supplierStatus = await contract.suppliers(await contract.runner?.getAddress());
  const buyerStatus = await contract.buyers(await contract.runner?.getAddress());

  console.log("Deployer is supplier:", supplierStatus);
  console.log("Deployer is buyer:", buyerStatus);
  console.log("Deployment verification complete!");

  return contractAddress;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then((address) => {
    console.log("Deployment successful! Contract address:", address);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });