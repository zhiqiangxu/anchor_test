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

  console.log("bigInt",bigInt,"paddedHex.length", paddedHex.length);
  // Convert each pair of hex digits to a byte
  for (let i = 0; i < paddedHex.length; i += 2) {
    byteArray.push(parseInt(paddedHex.substr(i, 2), 16));
  }

  return byteArray;
}

function numArrayTo32ByteArray(nums: string[]): number[][] {
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

  it("numArrayTo32ByteArray" , async () => {
    let result = numArrayTo32ByteArray(["281381539368714457797870087120157348141"]);
    console.log(result);
  });
  it("Verify pass!", async () => {
    const args = {
      publicInputs: numArrayTo32ByteArray(["281381539368714457797870087120157348141", "4047353509698631634547087112581142728", "113161003597028563593046056578752446929", "117452104231964725891150382183837185080", "20011376721690175780645228231741213708", "41362427191743139026751447860679676176"]),
      proofA: bigIntTo32ByteArray(BigInt("19401488753395977419141544209564290360560712338765132111823292523754711931453")).concat(bigIntTo32ByteArray(BigInt("16671803165682834880509569483594646884828874563586422333868016276086006387592"))),
      proofB: bigIntTo32ByteArray(BigInt("8436998338875602490144742848268752513539262095159024250188178408041951386571")).concat(bigIntTo32ByteArray(BigInt("11972731892849843283995276149148204633337915161335262790056802594513998660602")), bigIntTo32ByteArray(BigInt("18649225206658054981436979859121221366158879634844311150082956659878376569452")), bigIntTo32ByteArray(BigInt("19839479440454593810175175121366286040348894516244181385756728382903720339920"))),
      proofC: bigIntTo32ByteArray(BigInt("4240404523961270810921535146474479000568103105326740340335595828924930658682")).concat(bigIntTo32ByteArray(BigInt("13601772844446145400101440963537158156250275027731141903982516679114136835826"))),
    };
    console.log(args);
    const tx = await program.methods.verify(args)
      .preInstructions([
        anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
          units: 600000,
        }),
        anchor.web3.ComputeBudgetProgram.requestHeapFrame({
          bytes: 1024*250,
        }),
      ]).rpc();
    console.log("Your transaction signature", tx);
  });
});
