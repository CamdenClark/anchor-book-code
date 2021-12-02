import * as anchor from "@project-serum/anchor";
import { assert } from "chai";

const provider = anchor.Provider.env();
anchor.setProvider(provider);

const program = anchor.workspace.SimpleCounter;

const initializeCounter = async (amount: number) => {
  const counter = anchor.web3.Keypair.generate();

  await program.rpc.initialize(new anchor.BN(amount), {
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
  it("Initializes the counter to 0", async () => {
    const counter = await initializeCounter(2);

    const counterData = await program.account.counter.fetch(counter);

    assert.ok(counterData.count.eq(new anchor.BN(2)));
  });
  it("Increments the counter", async () => {
    const counter = await initializeCounter(2);

    await program.rpc.increment({ accounts: { counter } });

    const counterData = await program.account.counter.fetch(counter);

    assert.ok(counterData.count.eq(new anchor.BN(3)));
  });
});
