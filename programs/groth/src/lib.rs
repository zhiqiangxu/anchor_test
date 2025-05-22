use anchor_lang::prelude::*;

declare_id!("HkFStTqPEnfq4R9UiymSmqhz4gLMydQ35CvBDduHSuPw");

mod instructions;
pub use instructions::*;

use groth16_solana::groth16::Groth16Verifier;

#[program]
pub mod groth {
    use super::*;

    pub fn verify(ctx: Context<Verify>, args: VerifyArgs) -> Result<()> {
        let mut args = args;
        for b in [
            31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 22, 21,
            20, 19, 18, 17, 16, 15, 14, 13, 12, 12,
        ] {
            let mut bytes: [u8; 32] = [0; 32];
            bytes[31] = b as u8;
            args.public_inputs.push(bytes);
        }

        msg!("step 1");
        let pi = args.public_inputs.try_into().unwrap();
        msg!("step 2");
        let mut verifier = Groth16Verifier::<'_, { VERIFYINGKEY.nr_pubinputs - 1 }>::new(
            &args.proof_a,
            &args.proof_b,
            &args.proof_c,
            &pi,
            &VERIFYINGKEY,
        )
        .unwrap();
    msg!("step 3");
        verifier.verify().unwrap();
        msg!("step 4");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Verify {}
