import { MerkleTree } from 'merkletreejs';
import { keccak256, toUtf8Bytes } from 'ethers';

// Paste your whitelist addresses here
const whitelist = [
  '0xAbC1234567890abcdef1234567890abcdef1234A',
  '0xDef4567890abcdef1234567890abcdef12345678',
];

// Build Merkle tree and log the root
const leaves = whitelist.map(addr => keccak256(toUtf8Bytes(addr.toLowerCase())));
const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

console.log(tree.getHexRoot());
