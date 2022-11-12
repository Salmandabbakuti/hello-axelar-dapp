import {
  getDefaultWallets,
  connectorsForWallets,
  RainbowKitProvider,
  lightTheme
} from "@rainbow-me/rainbowkit";
import {
  braveWallet,
  argentWallet,
  imTokenWallet,
  trustWallet,
  ledgerWallet
} from "@rainbow-me/rainbowkit/wallets";
import {
  WagmiConfig,
  configureChains,
  createClient,
  chain,
  defaultChains,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import "../styles/globals.css";

const { chains, provider, webSocketProvider } = configureChains(
  [
    ...defaultChains,
    chain.polygon,
    chain.polygonMumbai,
    chain.sepolia,
    {
      id: 43113,
      name: "Fuji(C-Chain)",
      rpcUrls: {
        public: "https://api.avax-test.network/ext/bc/C/rpc",
        default: "https://api.avax-test.network/ext/bc/C/rpc"
      },
      nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 }
    },
    {
      id: 1287,
      name: "Moonbeam Alpha",
      rpcUrls: {
        public: "https://moonbeam-alpha.api.onfinality.io/public",
        default: "https://moonbeam-alpha.api.onfinality.io/public"
      },
      nativeCurrency: { name: "DEV", symbol: "DEV", decimals: 18 }
    }
  ],
  [
    publicProvider(),
    jsonRpcProvider({
      rpc: (chain) => ({
        http: chain.rpcUrls,
      }),
    })
  ]
);

const { wallets } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains
});

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [
      argentWallet({ chains }),
      trustWallet({ chains }),
      ledgerWallet({ chains }),
      braveWallet({ chains }),
      imTokenWallet({ chains })
    ]
  }
]);

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider
});

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider
        chains={chains}
        showRecentTransactions={true}
        modalSize="wide"
        // avatar={() => <img src="/favicon.ico" width={50} height={50} />}
        theme={lightTheme()}
        appInfo={{
          appName: "Wagmi Next Dapp",
          learnMoreUrl: "https://www.rainbowkit.com/",
          disclaimer: () => (
            <p>This is a demo app. Do not use this app for production</p>
          )
        }}
      >
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
