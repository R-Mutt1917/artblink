// Client
console.log("My address:", pg.wallet.publicKey.toString());
const balance = await pg.connection.getBalance(pg.wallet.publicKey);
console.log(`My balance: ${balance / web3.LAMPORTS_PER_SOL} SOL`);

// Cliente de prueba para ArtBlink
// Corre cada función y verifica que funcione

const program = pg.program;
const user = pg.wallet.publicKey;

// ─── Helper: buscar dirección PDA ─────────────────────────────────────
async function findProfilePDA() {
  const [pda] = await anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("profile"), user.toBuffer()],
    program.programId
  );
  return pda;
}

async function findArtPDA(title: string) {
  const [pda] = await anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("art"), user.toBuffer(), Buffer.from(title)],
    program.programId
  );
  return pda;
}

// ─── TEST 1: Crear perfil ──────────────────────────────────────────────
async function testCreateProfile() {
  console.log("🎨 Creando perfil de artista...");

  const profilePDA = await findProfilePDA();

  try {
    const tx = await program.methods
      .createProfile("R.Mutt", "Artista visual de Rosario")
      .accounts({
        artistProfile: profilePDA,
        user: user,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("✅ Perfil creado! TX:", tx);

    // Leer los datos guardados
    const profile = await program.account.artistProfile.fetch(profilePDA);
    console.log("📋 Datos del perfil:");
    console.log("   Nombre:", profile.name);
    console.log("   Bio:", profile.bio);
    console.log("   Owner:", profile.owner.toString());
  } catch (e) {
    console.log("⚠️  Perfil ya existe o error:", e.message);
  }
}

// ─── TEST 2: Publicar obra ─────────────────────────────────────────────
async function testCreateArt() {
  console.log("\n🖼  Publicando obra...");

  const title = "Obra Uno";
  const artPDA = await findArtPDA(title);

  try {
    const tx = await program.methods
      .createArt(
        title,
        "https://picsum.photos/400/300",
        "Mi primera obra on-chain"
      )
      .accounts({
        artPost: artPDA,
        user: user,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("✅ Obra publicada! TX:", tx);

    const art = await program.account.artPost.fetch(artPDA);
    console.log("📋 Datos de la obra:");
    console.log("   Título:", art.title);
    console.log("   URL:", art.imageUrl);
    console.log("   Likes:", art.likes.toString());
  } catch (e) {
    console.log("⚠️  Error:", e.message);
  }
}

// ─── TEST 3: Dar like ──────────────────────────────────────────────────
async function testLikeArt() {
  console.log("\n❤️  Dando like...");

  const artPDA = await findArtPDA("Obra Uno");

  const tx = await program.methods
    .likeArt()
    .accounts({
      artPost: artPDA,
      user: user,
    })
    .rpc();

  console.log("✅ Like enviado! TX:", tx);

  const art = await program.account.artPost.fetch(artPDA);
  console.log("   Likes ahora:", art.likes.toString());
}

// ─── TEST 4: Dar propina ───────────────────────────────────────────────
async function testTipArt() {
  console.log("\n💰 Enviando propina...");

  const artPDA = await findArtPDA("Obra Uno");
  const profilePDA = await findProfilePDA();

  // 0.01 SOL en lamports (1 SOL = 1_000_000_000 lamports)
  const amount = new anchor.BN(10_000_000);

  const tx = await program.methods
    .tipArt(amount)
    .accounts({
      artPost: artPDA,
      tipper: user,
      artist: user, // en el test nos mandamos a nosotros mismos
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .rpc();

  console.log("✅ Propina enviada! TX:", tx);

  const art = await program.account.artPost.fetch(artPDA);
  console.log("   Total tips:", art.tipTotal.toString(), "lamports");
}

// ─── CORRER TODOS LOS TESTS ────────────────────────────────────────────
async function main() {
  console.log("🚀 Iniciando tests de ArtBlink");
  console.log("================================");
  console.log("Wallet:", user.toString());

  await testCreateProfile();
  await testCreateArt();
  await testLikeArt();
  await testTipArt();

  console.log("\n================================");
  console.log("✅ Todos los tests completados!");
}

main();
