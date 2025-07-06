require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.30",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545", // port de Ganache
      accounts: [
        "0x37b97d8d9ecf83d4dd4e5e25d6306373b4e163684635d2ca7c2ce827d18ed2e1"  // Remplacez par la clé privée du compte Ganache
      ]
    }
  }
};
