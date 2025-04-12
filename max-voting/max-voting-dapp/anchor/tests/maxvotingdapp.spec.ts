import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { Maxvotingdapp } from '../target/types/maxvotingdapp'
import { BankrunProvider, startAnchor } from "anchor-bankrun";

const IDL = require('../target/idl/maxvotingdapp.json')

const votingAddress = new PublicKey("8Kh67UCHewo5nDS8n7xhEFD3ta1665CBSe7TBc6BDe8R")

describe('maxvotingdapp', () => {

  let context;
  let provider;
  anchor.setProvider(anchor.AnchorProvider.env());
  let votingProgram = anchor.workspace.Maxvotingdapp as Program<Maxvotingdapp>;

  beforeAll(async () => {
    // context = await startAnchor("", [{name: "maxvotingdapp", programId: votingAddress}], []);

    // provider = new BankrunProvider(context);

    // votingProgram = new Program<Maxvotingdapp>(
    //   IDL,
    //   provider,
    // );
  })

  it('Initialize Poll', async () => {

    await votingProgram.methods.intializePoll(
      new anchor.BN(1),
      new anchor.BN(0),
      new anchor.BN(1841071020),
      "What is your favorite type of candiate?",
    ).rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
      votingAddress
    )

    const poll = await votingProgram.account.poll.fetch(pollAddress);

    console.log(poll);

    expect(poll.pollId.toNumber()).toBe(1);
    expect(poll.description).toBe("What is your favorite type of candiate?");
    expect(poll.candidateAmount.toNumber()).toBe(0);
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());

  })

  it('Initialize Candidate', async () => {

    await votingProgram.methods.initializeCandidate(
      "cat",
      new anchor.BN(1),
    ).rpc();

    await votingProgram.methods.initializeCandidate(
      "dog",
      new anchor.BN(1),
    ).rpc();

    const [candidateOne] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("cat")],
      votingAddress
    )

    const [candidateTwo] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("dog")],
      votingAddress
    )

    const candidate1= await votingProgram.account.candidate.fetch(candidateOne);

    const candidate2 = await votingProgram.account.candidate.fetch(candidateTwo);

    console.log(candidate1);

    console.log(candidate2);

    expect(candidate1.candidateName).toBe("cat");
    expect(candidate1.candidateVote.toNumber()).toBe(0);

    expect(candidate2.candidateName).toBe("dog");
    expect(candidate2.candidateVote.toNumber()).toBe(0);
  })

  it('Vote', async () => {
    await votingProgram.methods.vote(
      "cat",
      new anchor.BN(1),
    ).rpc();

    const [candidateOne] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("cat")],
      votingAddress
    )

    const candidate1= await votingProgram.account.candidate.fetch(candidateOne);

    console.log(candidate1);
    expect(candidate1.candidateVote.toNumber()).toBe(1);
  })
})
 