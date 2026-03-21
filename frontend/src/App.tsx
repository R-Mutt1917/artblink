import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { ArtFeed } from "./components/ArtFeed";
import { CreateProfile } from "./components/CreateProfile";
import { CreateArt } from "./components/CreateArt";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./App.css";

function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="app">
            <header className="header">
              <h1>🎨 ArtBlink</h1>
              <p>Arte visual on-chain en Solana</p>
              <WalletMultiButton />
            </header>
            <main className="main">
              <CreateProfile />
              <CreateArt />
              <ArtFeed />
            </main>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;