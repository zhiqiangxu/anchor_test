use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct VerifyArgs {
    pub public_inputs: Vec<[u8; 32]>,
    pub proof_a: [u8;64],
    pub proof_b: [u8;128],
    pub proof_c: [u8;64],
}