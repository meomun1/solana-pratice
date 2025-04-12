// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import MaxvotingdappIDL from '../target/idl/maxvotingdapp.json'
import type { Maxvotingdapp } from '../target/types/maxvotingdapp'

// Re-export the generated IDL and type
export { Maxvotingdapp, MaxvotingdappIDL }

// The programId is imported from the program IDL.
export const MAXVOTINGDAPP_PROGRAM_ID = new PublicKey(MaxvotingdappIDL.address)

// This is a helper function to get the Maxvotingdapp Anchor program.
export function getMaxvotingdappProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...MaxvotingdappIDL, address: address ? address.toBase58() : MaxvotingdappIDL.address } as Maxvotingdapp, provider)
}

// This is a helper function to get the program ID for the Maxvotingdapp program depending on the cluster.
export function getMaxvotingdappProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Maxvotingdapp program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return MAXVOTINGDAPP_PROGRAM_ID
  }
}
