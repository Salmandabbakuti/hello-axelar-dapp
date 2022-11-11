
const { getDefaultProvider, Wallet } = require("ethers");
const { utils: { deployContract } } = require("@axelar-network/axelar-local-dev");
const fs = require("fs/promises");
require("dotenv").config();
const chains = require("../chains");

const wallet = new Wallet(process.env.PRIV_KEY);
const moonbeamChain = chains[0];
const avalancheChain = chains[1];

const GreeterContractFactory = require("../artifacts/contracts/Greeter.sol/Greeter.json");

async function main() {
  // deploy sender contract on moonbeam
  const moonbeamProvider = getDefaultProvider(moonbeamChain.rpc);
  const moonbeamConnectedWallet = wallet.connect(moonbeamProvider);
  const moonbeamGreeterContract = await deployContract(
    moonbeamConnectedWallet,
    GreeterContractFactory,
    [moonbeamChain.gateway, moonbeamChain.gasReceiver, moonbeamChain.name]
  );

  await moonbeamGreeterContract.deployed();
  console.log("Greeter contract deployed to moonbeam at: ", moonbeamGreeterContract.address);

  moonbeamChain.greeterAddress = moonbeamGreeterContract.address;

  const avalancheProvider = getDefaultProvider(avalancheChain.rpc);
  const avalancheConnectedWallet = wallet.connect(avalancheProvider);
  const avalancheGreeterContract = await deployContract(
    avalancheConnectedWallet,
    GreeterContractFactory,
    [avalancheChain.gateway, avalancheChain.gasReceiver, avalancheChain.name]
  );

  await avalancheGreeterContract.deployed();
  console.log("Greeter contract deployed to avalanche at: ", avalancheGreeterContract.address);
  avalancheChain.greeterAddress = avalancheGreeterContract.address;

  // update chains
  const updatedChains = [moonbeamChain, avalancheChain];
  await fs.writeFile(
    "chains.json",
    JSON.stringify(updatedChains, null, 2)
  );
}

main()
  .then(() => {
    console.log("Contracts deployed successfully");
  })
  .catch((error) => {
    console.error(error);
  });
