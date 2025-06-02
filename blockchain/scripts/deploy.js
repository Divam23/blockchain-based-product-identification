const hre = require("hardhat");

async function main() {
  const ProductRegistry = await hre.ethers.getContractFactory("ProductRegistry");

  console.log("Deploying ProductRegistry...");

  const productRegistry = await ProductRegistry.deploy();

  await productRegistry.waitForDeployment();

  console.log("ProductRegistry deployed to:", productRegistry.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

