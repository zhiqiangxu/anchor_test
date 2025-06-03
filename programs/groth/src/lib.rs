use anchor_lang::prelude::*;

declare_id!("HkFStTqPEnfq4R9UiymSmqhz4gLMydQ35CvBDduHSuPw");

mod instructions;
pub use instructions::*;

use ark_serialize::{CanonicalDeserialize, CanonicalSerialize, Compress, Validate};
use groth16_solana::groth16::Groth16Verifier;
use std::ops::Neg;

type G1 = ark_bn254::g1::G1Affine;
type G2 = ark_bn254::g2::G2Affine;

pub fn to_hex_string(bytes: &[u8]) -> String {
    let strs: Vec<String> = bytes.iter().map(|b| format!("{:02X}", b)).collect();
    strs.join("")
}

fn change_endianness(bytes: &[u8]) -> Vec<u8> {
    let mut vec = Vec::new();
    for b in bytes.chunks(32) {
        for byte in b.iter().rev() {
            vec.push(*byte);
        }
    }
    vec
}

#[program]
pub mod groth {
    use super::*;

    pub fn verify(ctx: Context<Verify>, args: VerifyArgs) -> Result<()> {
        msg!("step 1");
        let pi = args.public_inputs.try_into().unwrap();
        msg!("step 2");

        let proof_a: G1 = G1::deserialize_with_mode(
            &*[&change_endianness(&args.proof_a), &[0u8][..]].concat(),
            Compress::No,
            Validate::Yes,
        )
        .unwrap();
        let mut proof_a_neg = [0u8; 65];
        proof_a
            .neg()
            .x
            .serialize_with_mode(&mut proof_a_neg[..32], Compress::No)
            .unwrap();
        proof_a
            .neg()
            .y
            .serialize_with_mode(&mut proof_a_neg[32..], Compress::No)
            .unwrap();

        let proof_a = change_endianness(&proof_a_neg[..64]).try_into().unwrap();
        let mut verifier = Groth16Verifier::<'_, { VERIFYINGKEY.nr_pubinputs - 1 }>::new(
            &proof_a,
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
