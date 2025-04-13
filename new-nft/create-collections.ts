import {
    createNft,
    fetchDigitalAsset,
    mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";

import {
    airdropIfRequired,
    getExplorerLink,
    getKeypairFromFile,
} from "@solana-developers/helpers";

import {
    createUmi,
} from "@metaplex-foundation/umi-bundle-defaults"

import {
    Connection,
    LAMPORTS_PER_SOL,
    clusterApiUrl,
} from "@solana/web3.js";

import { generateSigner, keypairIdentity, percentAmount } from "@metaplex-foundation/umi";

// Creata a connection
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Load the wallet
const user = await getKeypairFromFile("~/.config/solana/devnet.json");

const balance = await connection.getBalance(user.publicKey);
console.log(`Wallet balance: ${balance / LAMPORTS_PER_SOL} SOL`);

// Airdrop some SOL to the wallet
await airdropIfRequired(connection, user.publicKey, 2 * LAMPORTS_PER_SOL, 0.5 * LAMPORTS_PER_SOL);

console.log("Loaded user", user.publicKey.toBase58());

// Make umi instance
const umi = createUmi(connection.rpcEndpoint);
umi.use(mplTokenMetadata());

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiUser));

console.log("Set up umi instance for user");

// Make collection
const collectionMint = generateSigner(umi);

const transaction = await createNft(umi, {
    mint: collectionMint,
    name: "Max NFT",
    symbol: "MAX",
    uri: "https://raw.githubusercontent.com/meomun1/solana-pratice/refs/heads/main/new-nft/metadata.json",
    sellerFeeBasisPoints: percentAmount(0),
    isCollection: true,
});

await transaction.sendAndConfirm(umi);

const createdCollectionNft = await fetchDigitalAsset(umi, collectionMint.publicKey);

console.log(`Create collection with address is ${getExplorerLink("address", createdCollectionNft.mint.publicKey, "devnet")}`)
