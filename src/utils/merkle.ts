import Whitelist from '../models/Whitelist';
import { MerkleTree } from 'merkletreejs';
import { keccak256 } from 'ethers';

let tree: MerkleTree;
let root: string;

export async function rebuildMerkleTree(): Promise<string> {
  const docs = await Whitelist.find().lean();
  console.log(docs);
  const leaves = docs.map(d => keccak256(d.walletAddress.toLowerCase()));
  console.log("leaves",leaves);
  tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  root = tree.getHexRoot();
  return root;
}

export function getMerkleProof(address: string): string[] {
  return tree.getHexProof(keccak256(address.toLowerCase()));
}

export function getMerkleRoot(): string {
  return root;
}
