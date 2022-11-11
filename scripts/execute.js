
const { getDefaultProvider, Wallet, Contract } = require("ethers");
const { AxelarQueryAPI, Environment, EvmChain, GasToken } = require('@axelar-network/axelarjs-sdk');
require("dotenv").config();
const chains = require("../chains");

const wallet = new Wallet(process.env.PRIV_KEY);
const moonbeamChain = chains[0];
const avalancheChain = chains[1];

const GreeterContractFactory = require("../artifacts/contracts/Greeter.sol/Greeter.json");

const getGasFee = async (
  sourceChainName,
  destinationChainName,
  sourceChainTokenSymbol
) => {
  const api = new AxelarQueryAPI({ environment: Environment.TESTNET });
  const gasFee = await api.estimateGasFee(sourceChainName, destinationChainName, sourceChainTokenSymbol);
  return gasFee;
};

async function main() {
  const moonbeamProvider = getDefaultProvider(moonbeamChain.rpc);
  const moonbeamConnectedWallet = wallet.connect(moonbeamProvider);
  const avalancheProvider = getDefaultProvider(avalancheChain.rpc);
  const avalancheConnectedWallet = wallet.connect(avalancheProvider);
  const greetingToAvalancheContract = "Hello from Moonbeam";
  const greetingToMoonbeamContract = "Hello from Avalanche";

  const moonbeamGreeterContract = new Contract(moonbeamChain.greeterAddress, GreeterContractFactory.abi, moonbeamConnectedWallet);
  const avalancheGreeterContract = new Contract(avalancheChain.greeterAddress, GreeterContractFactory.abi, avalancheConnectedWallet);
  // get greetings on both chains
  const greetingOnMoonbeam = await moonbeamGreeterContract.message();
  const greetingOnAvalanche = await avalancheGreeterContract.message();
  console.log("Current greeting on moonbeam: ", greetingOnMoonbeam);
  console.log("Current greeting on avalanche: ", greetingOnAvalanche);

  // send greetings to each other and listen for events
  const setGretingToAvalancheTx = await moonbeamGreeterContract.setGreeting(
    "Avalanche",
    avalancheChain.greeterAddress,
    greetingToAvalancheContract,
    {
      value: BigInt(3e17),
      gasLimit: 3e6
    }
  );
  console.log("setGreeting tx: moonbeam --> avalanche:", setGretingToAvalancheTx.hash);
  // Listening for an event to be emitted on the Avalanche chain
  await new Promise((resolve) => {
    console.log("Waiting for an event to be emitted on avalanche...");
    avalancheGreeterContract.on("MessageChanged", (message, source, sender) => {
      console.log("Received an event on avalanche: ", message, source, sender);
      avalancheGreeterContract.removeAllListeners("MessageChanged");
      resolve();
    });
  });

  await setGretingToAvalancheTx.wait();

  const setGreetingToMoonbeamTx = await avalancheGreeterContract.setGreeting(
    "Moonbeam",
    moonbeamChain.greeterAddress,
    greetingToMoonbeamContract,
    {
      value: BigInt(3e17),
      gasLimit: 3e6
    }
  );
  console.log("setGreeting tx: avalanche --> moonbeam:", setGreetingToMoonbeamTx.hash);

  //Listening for an event to be emitted on the Moonbeam chain
  await new Promise((resolve) => {
    console.log("Waiting for an event to be emitted on moonbeam...");
    moonbeamGreeterContract.on("MessageChanged", (message, source, sender) => {
      console.log("Received an event on moonbeam: ", message, source, sender);
      moonbeamGreeterContract.removeAllListeners("MessageChanged");
      resolve();
    });
  });
  await setGreetingToMoonbeamTx.wait();

  // get greetings on both chains after txs
  const greetingOnMoonbeamAfter = await moonbeamGreeterContract.message();
  const greetingOnAvalancheAfter = await avalancheGreeterContract.message();
  console.log("Greeting on moonbeam after: ", greetingOnMoonbeamAfter);
  console.log("Greeting on avalanche after: ", greetingOnAvalancheAfter);
}

main().then(() => {
  console.log("Execution completed");
  process.exit(0);
}).catch((error) => {
  console.log("error: ", error);
  process.exit(1);
});