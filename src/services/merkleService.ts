import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { rebuildMerkleTree } from '../utils/merkle';
dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

import {ClaimVaultABI} from '../abis/ClaimVault';

const contract = new ethers.Contract(
  process.env.CLAIM_VAULT_ADDRESS!,
  ClaimVaultABI,
  signer
);

export async function updateMerkleRootOnChain(): Promise<string> {
  const newRoot = await rebuildMerkleTree();
  const tx = await contract.setMerkleRoot(newRoot);
  await tx.wait();
  return newRoot;
}
