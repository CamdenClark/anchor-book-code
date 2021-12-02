import * as anchor from "@project-serum/anchor";
import { Connection } from "@solana/web3.js";
import { assert } from "chai";

describe("simple-counter", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const counter = anchor.web3.Keypair.generate();
  const program = anchor.workspace.SimpleCounter;

  it("Initializing counter to 100 or above throws an error", async () => {
    let transactionFailed = false;

    try {
      await program.rpc.initialize(new anchor.BN(100), {
        accounts: {
          counter: counter.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [counter],
      });
    } catch {
      transactionFailed = true;
    }

    assert.ok(transactionFailed);
  });

  it("Initializes the counter to 98", async () => {
    await program.rpc.initialize(new anchor.BN(98), {
      accounts: {
        counter: counter.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [counter],
    });

    const counterData = await program.account.counter.fetch(counter.publicKey);

    assert.ok(counterData.count.eq(new anchor.BN(98)));
  });

  it("Increments the counter", async () => {
    await program.rpc.increment({
      accounts: {
        counter: counter.publicKey,
        authority: provider.wallet.publicKey,
      },
    });

    const counterData = await program.account.counter.fetch(counter.publicKey);

    assert.ok(counterData.count.eq(new anchor.BN(99)));
  });

  it("Incrementing above 99 fails", async () => {
    let transactionFailed = false;
    try {
      await program.rpc.increment({
        accounts: {
          counter: counter.publicKey,
          authority: provider.wallet.publicKey,
        },
      });
    } catch {
      transactionFailed = true;
    }

    assert.ok(transactionFailed);
  });

  it("Another user attempting to increment throws an error", async () => {
    let transactionFailed = false;
    const authority = anchor.web3.Keypair.generate();

    try {
      await program.rpc.increment({
        accounts: {
          counter: counter.publicKey,
          authority: authority.publicKey,
        },
        signers: [authority],
      });
    } catch {
      transactionFailed = true;
    }

    assert.ok(transactionFailed);
  });
});
