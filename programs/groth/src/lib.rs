use anchor_lang::prelude::*;

declare_id!("HkFStTqPEnfq4R9UiymSmqhz4gLMydQ35CvBDduHSuPw");

mod instructions;
mod verifying_key;
pub use instructions::*;

#[program]
pub mod groth {
    use super::*;

    pub fn verify(ctx: Context<Verify>, args: VerifyArgs) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Verify {}
