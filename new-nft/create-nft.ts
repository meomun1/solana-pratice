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
    PublicKey,
} from "@solana/web3.js";

import { generateSigner, keypairIdentity, percentAmount, publicKey } from "@metaplex-foundation/umi";

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

// Web3js
// const collectionAddress = new PublicKey("G4ABMsYFaRUCJ3nWJP3nvNaHxmK1r4Mr3z1TBYAK5S5w");

// Umi version
const collectionAdress = publicKey("G4ABMsYFaRUCJ3nWJP3nvNaHxmK1r4Mr3z1TBYAK5S5w");

console.log(`Create NFT..`);

const mint = generateSigner(umi);

const transaction = await createNft(umi, {
    mint,
    name: "Max NFT",
    symbol: "MAX",
    uri: "https://raw.githubusercontent.com/meomun1/solana-pratice/refs/heads/main/new-nft/metadata.json",
    sellerFeeBasisPoints: percentAmount(0),
    collection: {
        key: collectionAdress,
        verified: false,
    }
});

await transaction.sendAndConfirm(umi);
const createdNft = await fetchDigitalAsset(umi, mint.publicKey);
console.log(`Create NFT with address is ${getExplorerLink("address", createdNft.mint.publicKey, "devnet")}`);

