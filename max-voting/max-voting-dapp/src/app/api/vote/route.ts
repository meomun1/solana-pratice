import { ActionGetResponse, ActionPostRequest, ACTIONS_CORS_HEADERS, createPostResponse } from '@solana/actions'
import { Connection, Transaction } from '@solana/web3.js'
import {PublicKey } from '@solana/web3.js'
import { Maxvotingdapp } from '../../../../anchor/target/types/maxvotingdapp'
import { BN, Program } from '@coral-xyz/anchor'

const IDL = require('../../../../anchor/target/idl/maxvotingdapp.json')


export const OPTIONS = GET;

export async function GET(request: Request) {
  const actionMetadata: ActionGetResponse = {
    type: "action",
    icon: "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_3x4.jpg",
    title: "Vote for your favorite cat!",
    description: "Vote between cat and dog!",
    label: "Vote",
    links: {
      actions: [
        {
          type: "post",
          href: "/api/vote?candidate=cat",
          label: "Vote for your cat"
        }, 
        {
          type: "post",
          href: "/api/vote?candidate=dog",
          label: "Vote for your dog"
        }
      ]
    },
  }

  return Response.json(actionMetadata, { headers: ACTIONS_CORS_HEADERS})
}

export async function POST(request: Request) {
  const url = new URL(request.url)
  const candidate = url.searchParams.get("candidate")

  if(candidate !== "cat" && candidate !== "dog") {
    return new Response(JSON.stringify({ error: "Invalid candidate" }), { status: 400, headers: ACTIONS_CORS_HEADERS  })
  }

  const connection = new Connection("https://127.0.0.1:8899", "confirmed")
  const program: Program<Maxvotingdapp> = new Program(IDL, { connection })

  const body: ActionPostRequest = await request.json();
  let voter;

  try {
    voter = new PublicKey(body.account);
  } catch { 
    return new Response(JSON.stringify({ error: "Invalid account" }), { status: 400, headers: ACTIONS_CORS_HEADERS })
  }

  const instruction = await program.methods
  .vote(candidate, new BN(1))
  .accounts({
    signer: voter
  })
  .instruction();

  const blockhash = await connection.getLatestBlockhash();

  const transaction = new Transaction({
    feePayer: voter,
    blockhash: blockhash.blockhash,
    lastValidBlockHeight: blockhash.lastValidBlockHeight,
  })
  .add(instruction);

  const response = await createPostResponse({
    fields: {
      type: "transaction",
      transaction: transaction,
    }
  });

  return new Response(JSON.stringify(response), { status: 200, headers: ACTIONS_CORS_HEADERS });
}