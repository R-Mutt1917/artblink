# 🎨 ArtBlink — Smart Contract (Anchor / Solana)

> Social on-chain platform for visual artists. Built on Solana using Anchor framework.

---

## 📌 Overview

ArtBlink is a decentralized social network where visual artists can publish their artwork on-chain. Anyone can interact with it by liking, tipping, or collecting pieces — all powered by Solana.

This repository contains the **on-chain program** built with [Anchor](https://www.anchor-lang.com/) and deployed on **Solana Devnet**.

---

## 🔗 Deployed Program

| Network | Program ID |
|---------|-----------|
| Devnet  | `4pnH8WgSinm6T3LhYS7BRyySta4G88mtHWLZWs6Rux1D` |

---

## 🏗 Architecture

The program uses **PDAs (Program Derived Addresses)** to store all on-chain data. No centralized database — everything lives on the blockchain.

```
artblink/
└── src/
    └── lib.rs        ← All program logic
```

### Accounts (PDAs)

| Account | Seeds | Description |
|---------|-------|-------------|
| `ArtistProfile` | `["profile", user_pubkey]` | Artist profile: name, bio, total tips |
| `ArtPost` | `["art", user_pubkey, title]` | Artwork: title, image URL, description, likes, tips |

---

## ⚙️ Instructions

### `create_profile(name, bio)`
Creates an artist profile PDA for the signer.

**Accounts:**
- `artist_profile` — PDA to initialize
- `user` — signer & payer
- `system_program`

### `create_art(title, image_url, description)`
Publishes a new artwork on-chain.

**Accounts:**
- `art_post` — PDA to initialize
- `user` — signer & payer
- `system_program`

### `like_art()`
Increments the like counter on an artwork.

**Accounts:**
- `art_post` — mutable
- `user` — signer

### `tip_art(amount: u64)`
Transfers SOL from tipper to artist and records the tip amount.

**Accounts:**
- `art_post` — mutable (records tip total)
- `tipper` — signer & payer
- `artist` — receives SOL
- `system_program`

---

## 🧱 Data Models

```rust
pub struct ArtistProfile {
    pub owner: Pubkey,     // wallet address
    pub name: String,      // max 50 chars
    pub bio: String,       // max 200 chars
    pub total_tips: u64,   // lamports received
}

pub struct ArtPost {
    pub artist: Pubkey,      // creator wallet
    pub title: String,       // max 100 chars
    pub image_url: String,   // max 200 chars
    pub description: String, // max 300 chars
    pub likes: u64,          // like counter
    pub tip_total: u64,      // total lamports tipped
}
```

---

## 🚀 How to Build & Deploy

This program was built using **[Solana Playground](https://beta.solpg.io)** — no local installation required.

1. Go to [beta.solpg.io](https://beta.solpg.io)
2. Create a new Anchor project
3. Paste the code from `src/lib.rs`
4. Click **Build** → then **Deploy**
5. Make sure your wallet is connected to **Devnet** and has SOL from the [faucet](https://faucet.solana.com)

---

## 🧪 Testing

Tests were run via the Solana Playground client (`client/client.ts`):

```
✅ Profile created — TX: 5daixzc...
✅ Artwork published — TX: 3A1Veof...
✅ Like sent — TX: 2n39Fpp...
✅ Tip of 0.01 SOL sent — TX: 5Lvavv...
```

All transactions are verifiable on [Solana Explorer (Devnet)](https://explorer.solana.com/?cluster=devnet).

---

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| Rust | Smart contract language |
| Anchor 0.30 | Solana framework |
| Solana Playground | Build & deploy IDE |
| Devnet | Test network |

---

## 📄 License

MIT