use anchor_lang::prelude::*;

declare_id!("HkFStTqPEnfq4R9UiymSmqhz4gLMydQ35CvBDduHSuPw");

mod instructions;
pub use instructions::*;

use groth16_solana::groth16::Groth16Verifier;

#[program]
pub mod groth {
    use super::*;

    pub fn verify(ctx: Context<Verify>, args: VerifyArgs) -> Result<()> {
        let pi = args.public_inputs.try_into().unwrap();
        let mut verifier = Groth16Verifier::<'_, {VERIFYINGKEY.nr_pubinputs-1}>::new(
            &args.proof_a,
            &args.proof_b,
            &args.proof_c,
            &pi,
            &VERIFYINGKEY,
        )
        .unwrap();
        verifier.verify().unwrap();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Verify {}
