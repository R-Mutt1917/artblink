import { Buffer } from "buffer";
import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3 } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import idl from "../idl/artblink.json";

const PROGRAM_ID = new PublicKey("4pnH8WgSinm6T3LhYS7BRyySta4G88mtHWLZWs6Rux1D");

export function CreateProfile() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  function getProgram() {
    (window as any).Buffer = Buffer;
    (globalThis as any).Buffer = Buffer;
    const provider = new AnchorProvider(connection, wallet as any, {
      commitment: "confirmed",
    });
    return new Program(idl as any, PROGRAM_ID, provider);
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
      const seedString = new TextEncoder().encode("profile");
      const pubkeyBytes = wallet.publicKey.toBytes();
      const [profilePDA] = PublicKey.findProgramAddressSync(
        [seedString, pubkeyBytes],
        PROGRAM_ID
      );
      const tx = await (program.methods as any)
        .createProfile(name, bio)
        .accounts({
          artistProfile: profilePDA,
          user: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();
      setStatus(`✅ Perfil creado! TX: ${tx}`);
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
      setIsError(true);
    }
    setLoading(false);
  }

  return (
    <div className="card">
      <h2>👤 Crear Perfil de Artista</h2>
      <input
        placeholder="Tu nombre artístico"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <textarea
        placeholder="Tu bio"
        value={bio}
        onChange={e => setBio(e.target.value)}
      />
      <button className="btn" onClick={handleSubmit} disabled={loading}>
        {loading ? "Creando..." : "Crear Perfil"}
      </button>
      {status && <div className={`status ${isError ? "error" : ""}`}>{status}</div>}
    </div>
  );
}