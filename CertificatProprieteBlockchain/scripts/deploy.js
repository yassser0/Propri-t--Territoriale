const hre = require("hardhat");

async function main() {
  const ContractFactory = await hre.ethers.getContractFactory("PropertyRegistry");

  const contract = await ContractFactory.deploy(); // déploiement
  await contract.waitForDeployment(); // nouvelle méthode dans Ethers v6+

  console.log("✅ Contrat déployé à :", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
