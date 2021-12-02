import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { FirstProgram } from '../target/types/first_program';

describe('first-program', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.FirstProgram as Program<FirstProgram>;

  it('Is initialized!', async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });
});
