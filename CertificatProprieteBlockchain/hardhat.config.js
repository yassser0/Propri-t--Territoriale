require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.30",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545", // port de Ganache
      accounts: [
        "0x0f96d34a9b323fdda63e848c915b67546683e83913c953c00b6c57b62bec8a32"  // Remplacez par la clé privée du compte Ganache
      ]
    }
  }
};
