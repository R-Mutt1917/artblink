import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import idl from "../idl/artblink.json";
import { Buffer } from "buffer";

const PROGRAM_ID = new PublicKey("4pnH8WgSinm6T3LhYS7BRyySta4G88mtHWLZWs6Rux1D");

export function CreateArt() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  function getProgram() {
    const provider = new AnchorProvider(connection, wallet as any, {
      commitment: "confirmed",
    });
    return new Program(idl as any, provider);
  }

  async function handleSubmit() {
    if (!wallet.publicKey) {
      setStatus("Conectá tu wallet primero");
      setIsError(true);
      return;
    }
    setLoading(true);
    setStatus("");
    setIsError(false);
    try {
      const program = getProgram();
      const [artPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("art"), wallet.publicKey.toBuffer(), Buffer.from(title)],
        PROGRAM_ID
      );
      const tx = await (program.methods as any)
        .createArt(title, imageUrl, description)
        .accounts({
          artPost: artPDA,
          user: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();
      setStatus(`✅ Obra publicada! TX: ${tx}`);
      setTitle("");
      setImageUrl("");
      setDescription("");
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
      setIsError(true);
    }
    setLoading(false);
  }

  return (
    <div className="card">
      <h2>🖼 Publicar Obra</h2>
      <input
        placeholder="Título de la obra"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input
        placeholder="URL de la imagen (https://...)"
        value={imageUrl}
        onChange={e => setImageUrl(e.target.value)}
      />
      <textarea
        placeholder="Descripción de la obra"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <button className="btn" onClick={handleSubmit} disabled={loading}>
        {loading ? "Publicando..." : "Publicar Obra"}
      </button>
      {status && <div className={`status ${isError ? "error" : ""}`}>{status}</div>}
    </div>
  );
}