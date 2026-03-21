# 🎨 ArtBlink — Frontend

> React frontend for ArtBlink — the on-chain social platform for visual artists on Solana.

---

## 📌 Overview

ArtBlink's frontend connects directly to the Solana Devnet program, allowing artists and collectors to interact with on-chain art without any centralized backend. Connect your wallet, publish artwork, like pieces, and tip artists — all on-chain.

---

## 🌐 Features

| Feature | Description |
|---------|-------------|
| 🔗 Wallet Connect | Supports Phantom, Backpack and other Solana wallets |
| 👤 Create Profile | Register as an artist on-chain |
| 🖼 Publish Artwork | Post art with title, image URL and description |
| ❤️ Like | Increment the like counter stored on-chain |
| 💰 Tip | Send 0.01 SOL directly to the artist's wallet |
| 📡 ArtFeed | Live feed of all on-chain artworks |

---

## 🏗 Project Structure

```
artblink-frontend/
├── src/
│   ├── components/
│   │   ├── CreateProfile.tsx   ← Artist profile form
│   │   ├── CreateArt.tsx       ← Artwork publishing form
│   │   └── ArtFeed.tsx         ← On-chain art feed with like & tip
│   ├── idl/
│   │   └── artblink.json       ← Anchor IDL (program interface)
│   ├── polyfills.ts            ← Browser Buffer polyfill
│   ├── App.tsx                 ← Wallet providers & layout
│   ├── App.css                 ← Styles
│   └── index.tsx               ← Entry point
├── config-overrides.js         ← Webpack polyfills config
└── package.json
```

---

## 🔗 Connected Program

| Network | Program ID |
|---------|-----------|
| Devnet  | `4pnH8WgSinm6T3LhYS7BRyySta4G88mtHWLZWs6Rux1D` |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- A Solana wallet browser extension (Phantom or Backpack)
- Wallet configured on **Devnet**
- Devnet SOL from [faucet.solana.com](https://faucet.solana.com)

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/artblink-frontend
cd artblink-frontend

npm install --ignore-scripts

npm start
```

App runs at `http://localhost:3000`

### Build for production

```bash
npm run build
```

---

## 🔑 Wallet Setup

1. Install [Backpack](https://backpack.app) or [Phantom](https://phantom.app)
2. Switch network to **Devnet**
3. Get free SOL from [faucet.solana.com](https://faucet.solana.com)
4. Connect wallet in the app (top right button)

---

## 🧱 How It Works

Each action in the app sends a real transaction to Solana Devnet:

```
User clicks "Crear Perfil"
    → AnchorProvider signs tx with wallet
    → Program.methods.createProfile() called
    → PDA created on-chain
    → TX hash returned and shown to user
```

The ArtFeed reads all `ArtPost` accounts directly from the program using:
```ts
program.account.artPost.all()
```

No API. No database. Pure on-chain.

---

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| React 19 + TypeScript | UI framework |
| @coral-xyz/anchor | Anchor client SDK |
| @solana/web3.js | Solana JS SDK |
| @solana/wallet-adapter | Wallet connection |
| react-app-rewired | Webpack config overrides |

---

## 🎯 Hackathon Categories

This project qualifies for:

- **🟣 Social On-Chain** — Profiles, posts, likes and tips all stored on Solana
- **🟣 NFTs** — Artwork published on-chain with metadata (extensible to Metaplex)
- **🟣 Blinks** — Each artwork PDA can be exposed as a Solana Action link

---

## 📄 License

MIT