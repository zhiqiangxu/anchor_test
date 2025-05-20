use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct VerifyArgs {
    pub key: Vec<u8>,
    pub hash: Vec<u8>,
    pub proof: Vec<u8>,
}