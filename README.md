# axelar-crosschain-dapp

This project demonstrates a basic crosschain interoperability using axelar network. Axelar delivers secure cross-chain communication. That means that Web3 developers can create dApps that can interact with any asset, any application, on any chain, with one click. You can think of it as Stripe for Web3.

**In this project we will be sending message from smartcontract on avalanche to smartcontract on moonbeam and vice versa.**

> Rename `env.example` to `.env` and add your env specific keys.

#### Steps:

Try running following tasks:

```shell
yarn install

yarn hardhat contracts:compile # compiles contracts

yarn contracts:deploy # deploys contracts

yarn hardhat contracts:execute # executes contract functionality

yarn hardhat help # shows help
```

##### Starting the frontend

```shell
yarn dev
```

#### Demo:

1. Moonbeam Contract Address: [0xF8d0eF7BB673d2c9a0Faf2f81c71496892d1295a]: https://moonbase.moonscan.io/address/0xF8d0eF7BB673d2c9a0Faf2f81c71496892d1295a

2. Avalance Contract Address: [0x12E14e3aaD07183568E0d18385a03faE5310fBe3]: https://testnet.snowtrace.io/address/0x12E14e3aaD07183568E0d18385a03faE5310fBe3

3. Axelar transactions: [0xc7203561EF179333005a9b81215092413aB86aE9]: https://testnet.axelarscan.io/address/0xc7203561EF179333005a9b81215092413aB86aE9

![Demo](https://github.com/Salmandabbakuti/hello-axelar-dapp/blob/main/screenshot.png)

![Demo Web](https://github.com/Salmandabbakuti/hello-axelar-dapp/blob/main/web.png)

```bash
D:\salman\hello-axelar-dapp>yarn contracts:execute
yarn run v1.22.19
warning ..\package.json: No license field
$ node scripts/execute.js
Current greeting on moonbeam:  Hello Cross-Chain
Current greeting on avalanche:  Hello Cross-Chain
setGreeting tx: moonbeam --> avalanche: 0x909fdce7985b82b880a159e29f481fd696070c5f019e395a58ac3cc890c807a1
Waiting for an event to be emitted on avalanche...
Received an event on avalanche:  Hello from Moonbeam Moonbeam 0xc7203561EF179333005a9b81215092413aB86aE9
setGreeting tx: avalanche --> moonbeam: 0x75db15fbffba69c0126bc66f7fe27cde292a8585f3b68209a4cd216fc7f92a75
Waiting for an event to be emitted on moonbeam...
Received an event on moonbeam:  Hello from Avalanche Avalanche 0xc7203561EF179333005a9b81215092413aB86aE9
Greeting on moonbeam after:  Hello from Avalanche
Greeting on avalanche after:  Hello from Moonbeam
Execution completed
Done in 716.56s.
```
