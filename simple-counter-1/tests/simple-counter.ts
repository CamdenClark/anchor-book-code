import * as anchor from "@project-serum/anchor";
import { assert } from "chai";

const provider = anchor.Provider.env();
anchor.setProvider(provider);

const program = anchor.workspace.SimpleCounter;

const initializeCounter = async () => {
  const counter = anchor.web3.Keypair.generate();

  await program.rpc.initialize({
    accounts: {
      counter: counter.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
    signers: [counter],
  });

  return counter.publicKey;
};

describe("simple-counter", () => {
  it("Is initialized!", async () => {
    const counter = await initializeCounter();

    const counterData = await program.account.counter.fetch(counter);

    assert.ok(counterData.count.eq(new anchor.BN(0)));
  });
});
