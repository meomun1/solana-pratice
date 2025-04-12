'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '../solana/solana-provider'
import { AppHero, ellipsify } from '../ui/ui-layout'
import { ExplorerLink } from '../cluster/cluster-ui'
import { useMaxcruddappProgram } from './maxcruddapp-data-access'
import { MaxcruddappCreate, MaxcruddappList } from './maxcruddapp-ui'
import { useMemo } from 'react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useCluster } from '../cluster/cluster-data-access'
import { getMaxcruddappProgram, getMaxcruddappProgramId } from '@project/anchor'

export default function MaxcruddappFeature() {
  const { publicKey } = useWallet()
  const { cluster } = useCluster()
  const programId = useMemo(() => getMaxcruddappProgramId(cluster.network as Cluster), [cluster])

  return publicKey ? (
    <div>
      <AppHero
        title="Maxcruddapp"
        subtitle={
          'Create a new account by clicking the "Create" button. The state of a account is stored on-chain and can be manipulated by calling the program\'s methods (increment, decrement, set, and close).'
        }
      >
        <p className="mb-6">
          <ExplorerLink path={`account/${programId}`} label={ellipsify(programId.toString())} />
        </p>
        <MaxcruddappCreate />
      </AppHero>
      <MaxcruddappList />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  )
}
