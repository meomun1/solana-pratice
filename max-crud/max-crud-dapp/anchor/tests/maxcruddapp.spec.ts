import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { Maxcruddapp } from '../target/types/maxcruddapp'
import { BankrunProvider, startAnchor } from "anchor-bankrun";

const IDL = require('../target/idl/maxcruddapp.json')

const crudAddress = new PublicKey("8gKpQKbWvjkbfHY1Gb62LGyuYd6sTNVH484gWm2zhCUt")

describe('maxcruddapp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const crudProgram = anchor.workspace.Maxcruddapp as Program<Maxcruddapp>

  const maxcruddappKeypair = Keypair.generate()

  it('Initialize journal', async () => {
    await crudProgram.methods.createJournalEntry(
      "This is a title",
      "This is a message",
    ).rpc();

    const [journalAddress] = PublicKey.findProgramAddress(
      
  })

  it('Update Journal', async (message : string) => {
    await crudProgram.methods.updateJournalEntry(
      "This is a title",
      message,
    ).rpc();
  })

  it('Delete Maxcruddapp ', async () => {
    await crudProgram.methods.deleteJournalEntry(
      "This is",).rpc();
  })


})
