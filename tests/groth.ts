import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Groth } from "../target/types/groth";

describe("groth", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Groth as Program<Groth>;

  it("Verify pass!", async () => {
    const args = {
      key: Buffer.from("key"),
      hash: Buffer.from("hash"),
      proof: Buffer.from("proof")
    };
    const tx = await program.methods.verify(args).rpc();
    console.log("Your transaction signature", tx);
  });
});
