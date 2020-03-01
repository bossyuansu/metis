const MIS = artifacts.require("MetisToken");
const MSC = artifacts.require("MSC");
const MULTI = artifacts.require("MultiSig");
require('@openzeppelin/test-helpers/configure')({ provider: web3.currentProvider, environment: 'truffle' });

const { singletons } = require('@openzeppelin/test-helpers');
const BN = require('bignumber.js');

module.exports = async function(deployer, network, accounts) {
  if (network === 'development') {
      // In a test environment an ERC777 token requires deploying an ERC1820 registry
      await singletons.ERC1820Registry(accounts[0]);
  }
  const tokenbits = (new BN(10)).pow(18); 
  const amount = (new BN(10000)).multipliedBy(tokenbits); 

  if (network === 'development') {
      await deployer.deploy(MIS, amount, [accounts[0], accounts[1]],[accounts[0], accounts[1]],[]);
      const token = await MIS.deployed();
      await deployer.deploy(MSC, [accounts[1], accounts[2]], accounts[0], 1, token.address, 10000);
      await deployer.deploy(MULTI, [accounts[0], accounts[1]], token.address);
  } else {
      await deployer.deploy(MIS, amount, [accounts[0]],[accounts[0]],[]);
  }
};
