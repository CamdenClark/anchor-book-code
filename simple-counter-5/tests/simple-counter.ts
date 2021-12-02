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
  it("Initializes the counter to 2", async () => {
    const counter = await initializeCounter(2);

    const counterData = await program.account.counter.fetch(counter);

    assert.ok(counterData.count.eq(new anchor.BN(2)));
  });
  it("Increments the counter", async () => {
    const counter = await initializeCounter(2);

    await program.rpc.increment({
      accounts: { counter, authority: provider.wallet.publicKey },
    });

    const counterData = await program.account.counter.fetch(counter);

    assert.ok(counterData.count.eq(new anchor.BN(3)));
  });
  it("Another user trying to increment throws an error", async () => {
    const counter = await initializeCounter(2);

    let transactionFailed = false;

    const anotherUser = anchor.web3.Keypair.generate();

    try {
      await program.rpc.increment({
        accounts: {
          counter,
          authority: anotherUser.publicKey,
        },
        signers: [anotherUser],
      });
    } catch {
      transactionFailed = true;
    }

    assert.ok(transactionFailed);
  });
  it("Initializing counter to 100 or above throws an error", async () => {
    let transactionFailed = false;

    try {
      await initializeCounter(100);
    } catch {
      transactionFailed = true;
    }

    assert.ok(transactionFailed);
  });
  it("Incrementing above 99 fails", async () => {
    const counter = await initializeCounter(99);

    let transactionFailed = false;

    try {
      await program.rpc.increment({
        accounts: {
          counter,
          authority: provider.wallet.publicKey,
        },
      });
    } catch {
      transactionFailed = true;
    }

    assert.ok(transactionFailed);
  });
});
