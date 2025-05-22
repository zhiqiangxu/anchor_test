import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Groth } from "../target/types/groth";

function bigIntTo32ByteArray(bigInt: BigInt): number[] {
  // Convert BigInt to a hex string
  const hexString = bigInt.toString(16);

  // Pad the hex string to ensure it is 64 characters (32 bytes)
  const paddedHex = hexString.padStart(64, '0');

  // Create a Uint8Array to hold the bytes
  const byteArray: number[] = [];

  // Convert each pair of hex digits to a byte
  for (let i = 0; i < paddedHex.length; i += 2) {
    byteArray.push(parseInt(paddedHex.substr(i, 2), 16));
  }

  return byteArray;
}

function numArrayTo32ByteArray(nums: number[]): number[][] {
  const result: number[][] = [];
  for (let i = 0; i < nums.length; i++) {
    result.push(bigIntTo32ByteArray(BigInt(nums[i])));
  }
  return result;
}


describe("groth", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Groth as Program<Groth>;

  it("Verify pass!", async () => {
    const args = {
      publicInputs: numArrayTo32ByteArray([146306961709, 8672030082371, 3636771157751, 6913510075492, 2965970540726, 26155409026, 1810808963537, 7896599018743, 1462571691757, 2949236054556, 1005780818684, 759016433783]),
      proofA: bigIntTo32ByteArray(BigInt(17922466838016240794786608827578862371569105487085573716215538402493050764612)).concat(bigIntTo32ByteArray(BigInt(10906367044198701794382115946634477498395055118527173555193508229945972785914))),
      proofB: bigIntTo32ByteArray(BigInt(14452208368547235621759955431055671182948338928173205242401410245941978634491)).concat(bigIntTo32ByteArray(BigInt(21048401342072133645640261827389021407318800043323648789184189632483499014757)), bigIntTo32ByteArray(BigInt(9665592993950276890451117532362737966217051668346780647436469272676562298776)), bigIntTo32ByteArray(BigInt(2826236686303105505074714778166714863977722649555928550652172904132727281842))),
      proofC: bigIntTo32ByteArray(BigInt(2668980436322419962635288249048180149471806583565149634238997560819305928416)).concat(bigIntTo32ByteArray(BigInt(5838763176840576243483947974991530837226517537782730017755644910273134960453))),
    };
    console.log(args);
    const tx = await program.methods.verify(args)
    .preInstructions([
      anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
        units: 600000,
      }),
    ]).rpc();
    console.log("Your transaction signature", tx);
  });
});
