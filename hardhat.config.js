require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/1kM_PYxmeVunkxk2K6hSkIO4siq5JP_c",
      accounts: ["0x3783f215201bd22ef1921274ce6eb159b6ebd5e294a80e60a7fbd5d226d09cbf"]
    }
  },
};