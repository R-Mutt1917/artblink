import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3, BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import idl from "../idl/artblink.json";
import { Buffer } from 'buffer';
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}

const PROGRAM_ID = new PublicKey("4pnH8WgSinm6T3LhYS7BRyySta4G88mtHWLZWs6Rux1D");

export function ArtFeed() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [tipStatus, setTipStatus] = useState<{ [key: string]: string }>({});

  function getProgram() {
    const provider = new AnchorProvider(
      connection,
      wallet.publicKey
        ? (wallet as any)
        : {
            publicKey: null,
            signTransaction: async (tx: any) => tx,
            signAllTransactions: async (txs: any) => txs,
          },
      {}
    );
    return new Program(idl as any, provider);
  }

  async function loadPosts() {
    setLoading(true);
    try {
      const program = getProgram();
      const allPosts = await (program.account as any).artPost.all();
      setPosts(allPosts);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (connection) {
      loadPosts();
    }
  }, []);

  async function handleLike(post: any) {
    if (!wallet.publicKey) return;
    try {
      const program = getProgram();
      await (program.methods as any)
        .likeArt()
        .accounts({
          artPost: post.publicKey,
          user: wallet.publicKey,
        })
        .rpc();
      await loadPosts();
    } catch (e: any) {
      console.error(e);
    }
  }

  async function handleTip(post: any) {
    if (!wallet.publicKey) return;
    const key = post.publicKey.toString();
    setTipStatus(s => ({ ...s, [key]: "Enviando..." }));
    try {
      const program = getProgram();
      const amount = new BN(10_000_000);
      await (program.methods as any)
        .tipArt(amount)
        .accounts({
          artPost: post.publicKey,
          tipper: wallet.publicKey,
          artist: post.account.artist,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();
      setTipStatus(s => ({ ...s, [key]: "✅ Propina enviada!" }));
      await loadPosts();
    } catch (e: any) {
      setTipStatus(s => ({ ...s, [key]: `Error: ${e.message}` }));
    }
  }

  return (
    <div className="card">
      <h2>🎨 ArtFeed</h2>
      <button className="btn" onClick={loadPosts} style={{ marginBottom: 20 }}>
        {loading ? "Cargando..." : "Actualizar Feed"}
      </button>
      {posts.length === 0 && !loading && (
        <p style={{ color: "#888" }}>No hay obras todavía. ¡Publicá la primera!</p>
      )}
      <div className="art-grid">
        {posts.map(post => (
          <div key={post.publicKey.toString()} className="art-card">
            <img
              src={post.account.imageUrl}
              alt={post.account.title}
              onError={(e: any) => {
                e.target.src = "https://picsum.photos/400/300";
              }}
            />
            <div className="art-card-body">
              <h3>{post.account.title}</h3>
              <p>{post.account.description}</p>
              <p style={{ fontSize: 12, color: "#555", marginBottom: 12 }}>
                {post.account.artist.toString().slice(0, 8)}...
              </p>
              <div className="art-actions">
                <button className="btn-like" onClick={() => handleLike(post)}>
                  ❤️ {post.account.likes.toString()}
                </button>
                <button className="btn-tip" onClick={() => handleTip(post)}>
                  💰 Tip 0.01 SOL
                </button>
              </div>
              {tipStatus[post.publicKey.toString()] && (
                <div className="status">{tipStatus[post.publicKey.toString()]}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}