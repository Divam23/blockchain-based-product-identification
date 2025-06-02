import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";

export default {
  solidity: "0.8.28",
  networks: {
    localhost: {
      url: "http://127.0.0.1:7545",
      chainId: 1337, // Ganache default chain ID
      accounts: {
        mnemonic: "cook chase rib fiber beyond skin spy expect shift wheel merit lazy"
      }
    }
  },
  namedAccounts: {
    deployer: {
      default: 0, // use the first account as deployer
    },
  }
};
