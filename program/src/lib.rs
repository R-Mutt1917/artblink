use anchor_lang::prelude::*;

// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("4pnH8WgSinm6T3LhYS7BRyySta4G88mtHWLZWs6Rux1D");

#[program]
pub mod artblink {
    use super::*;

    // ─── Crear perfil de artista ───────────────────────
    pub fn create_profile(
        ctx: Context<CreateProfile>,
        name: String,
        bio: String,
    ) -> Result<()> {
        let profile = &mut ctx.accounts.artist_profile;
        profile.owner = ctx.accounts.user.key();
        profile.name = name;
        profile.bio = bio;
        profile.total_tips = 0;
        Ok(())
    }

    // ─── Publicar una obra ─────────────────────────────
    pub fn create_art(
        ctx: Context<CreateArt>,
        title: String,
        image_url: String,
        description: String,
    ) -> Result<()> {
        let post = &mut ctx.accounts.art_post;
        post.artist = ctx.accounts.user.key();
        post.title = title;
        post.image_url = image_url;
        post.description = description;
        post.likes = 0;
        post.tip_total = 0;
        Ok(())
    }

    // ─── Dar like a una obra ───────────────────────────
    pub fn like_art(ctx: Context<LikeArt>) -> Result<()> {
        let post = &mut ctx.accounts.art_post;
        post.likes += 1;
        Ok(())
    }

    // ─── Dar propina al artista ────────────────────────
    pub fn tip_art(ctx: Context<TipArt>, amount: u64) -> Result<()> {
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.tipper.key(),
            &ctx.accounts.artist.key(),
            amount,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.tipper.to_account_info(),
                ctx.accounts.artist.to_account_info(),
            ],
        )?;

        let post = &mut ctx.accounts.art_post;
        post.tip_total += amount;

        Ok(())
    }
}

// ═══════════════════════════════════════════════════════════════════════
// ESTRUCTURAS DE CUENTAS
// ═══════════════════════════════════════════════════════════════════════

#[derive(Accounts)]
pub struct CreateProfile<'info> {
    #[account(
        init,
        payer = user,
        space = ArtistProfile::LEN,
        seeds = [b"profile", user.key().as_ref()],
        bump
    )]
    pub artist_profile: Account<'info, ArtistProfile>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateArt<'info> {
    #[account(
        init,
        payer = user,
        space = ArtPost::LEN,
        seeds = [b"art", user.key().as_ref(), title.as_bytes()],
        bump
    )]
    pub art_post: Account<'info, ArtPost>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct LikeArt<'info> {
    #[account(mut)]
    pub art_post: Account<'info, ArtPost>,

    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct TipArt<'info> {
    #[account(mut)]
    pub art_post: Account<'info, ArtPost>,

    #[account(mut)]
    pub tipper: Signer<'info>,

    /// CHECK: esta cuenta solo recibe SOL
    #[account(mut)]
    pub artist: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

// ═══════════════════════════════════════════════════════════════════════
// MODELOS DE DATOS
// ═══════════════════════════════════════════════════════════════════════

#[account]
pub struct ArtistProfile {
    pub owner: Pubkey,      // 32 bytes
    pub name: String,       // 4 + 50 bytes
    pub bio: String,        // 4 + 200 bytes
    pub total_tips: u64,    // 8 bytes
}

impl ArtistProfile {
    const LEN: usize = 8    // discriminator de Anchor
        + 32                // owner
        + 4 + 50            // name
        + 4 + 200           // bio
        + 8;                // total_tips
}

#[account]
pub struct ArtPost {
    pub artist: Pubkey,      // 32 bytes
    pub title: String,       // 4 + 100 bytes
    pub image_url: String,   // 4 + 200 bytes
    pub description: String, // 4 + 300 bytes
    pub likes: u64,          // 8 bytes
    pub tip_total: u64,      // 8 bytes
}

impl ArtPost {
    const LEN: usize = 8    // discriminator de Anchor
        + 32                // artist
        + 4 + 100           // title
        + 4 + 200           // image_url
        + 4 + 300           // description
        + 8                 // likes
        + 8;                // tip_total
}