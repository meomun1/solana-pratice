// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import MaxcruddappIDL from '../target/idl/maxcruddapp.json'
import type { Maxcruddapp } from '../target/types/maxcruddapp'

// Re-export the generated IDL and type
export { Maxcruddapp, MaxcruddappIDL }

// The programId is imported from the program IDL.
export const MAXCRUDDAPP_PROGRAM_ID = new PublicKey(MaxcruddappIDL.address)

// This is a helper function to get the Maxcruddapp Anchor program.
export function getMaxcruddappProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...MaxcruddappIDL, address: address ? address.toBase58() : MaxcruddappIDL.address } as Maxcruddapp, provider)
}

// This is a helper function to get the program ID for the Maxcruddapp program depending on the cluster.
export function getMaxcruddappProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Maxcruddapp program on devnet and testnet.
      return new PublicKey('8gKpQKbWvjkbfHY1Gb62LGyuYd6sTNVH484gWm2zhCUt')
    case 'mainnet-beta':
    default:
      return MAXCRUDDAPP_PROGRAM_ID
  }
}
