import { Request, Response } from 'express';
import Claim, { IClaim } from '../models/Claim';
import Whitelist from '../models/Whitelist';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { MerkleTree } from 'merkletreejs';
import { ClaimVaultABI } from '../abis/ClaimVault';

dotenv.config();
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);


const claimVaultAddress = process.env.CLAIM_VAULT_ADDRESS!;
const claimVaultContract = new ethers.Contract(claimVaultAddress, ClaimVaultABI, wallet);

export const postClaim = async (req: Request, res: Response) => {
  console.log("Check here")
  const { walletAddress,telegramId } = req.body;
  let baseAmount = process.env.CLAIM_AMOUNT;
  console.log("receipt1");
  if (!ethers.isAddress(walletAddress)) {
    return res.status(400).json({ success: false, error: "Invalid wallet address" });
  }
  console.log("isAddress");

  // Check for duplicate claim.
  const existingClaim = await Claim.findOne({ walletAddress: walletAddress.toLowerCase() });
  if (existingClaim) {
    return res.status(400).json({ success: false, error: "Already claimed" });
  }
  console.log("existingClaim");

  let bonusAmount = 0;
  let merkleProof: string[] = [];
  
  // Check whitelist for user's bonus.
  const whitelistEntry = await Whitelist.findOne({ walletAddress: walletAddress.toLowerCase() });
  console.log("whitelistEntry");
  if (whitelistEntry) {
    // Get all whitelist entries to build the Merkle tree.
    const whitelistData = await Whitelist.find({});
    const leaves = whitelistData.map((entry) => {
      const packed = ethers.solidityPacked(["address"], [entry.walletAddress.toLowerCase()]);
      const hash = ethers.keccak256(packed);
      return Buffer.from(hash.slice(2), "hex");
    });
    console.log("claim leaves", leaves);
    
    const tree = new MerkleTree(leaves, ethers.keccak256, { sortPairs: true });
    
    // Generate leaf for current user.
    const userPacked = ethers.solidityPacked(["address"], [walletAddress.toLowerCase()]);
    const userHash = ethers.keccak256(userPacked);
    const userLeaf = Buffer.from(userHash.slice(2), "hex");
    console.log("user leaf", userLeaf);
    merkleProof = tree.getHexProof(userLeaf);
    console.log("merkleProof",merkleProof);
  }
  console.log("whitelistEntry1");
  
  try {
    console.log("Calling claim with:", {
      walletAddress,
      baseAmount,
      merkleProof,
      typeof_walletAddress: typeof walletAddress,
      typeof_baseAmount: typeof baseAmount,
      proofArrayLength: merkleProof.length,
      proofType: typeof merkleProof[0]
    });
    const tx = await claimVaultContract.claim(
      walletAddress,
      Number(baseAmount),
      merkleProof
    );
    
    const receipt = await tx.wait();
    console.log("receipt",receipt.hash);
    // Save claim record in MongoDB.
    const newClaim: IClaim = new Claim({
      walletAddress: walletAddress.toLowerCase(),
      telegramId:telegramId,
      txHash: receipt.hash,
    });
    await newClaim.save();
    res.json({ success: true, txHash: receipt.hash });
  } catch (error: any) {
    console.error("Claim error:", error);
    console.error("Claim error1:", error.reason); 
      console.log("c2",(error.message.match(/reverted:\s*"([^"]+)"/)?.[1])); console.log("c3",error.message);
    res.status(500).json({ success: false, error: error.reason });
  }
};

export const getStatus = async (req: Request, res: Response) => {
  console.log("req",req.query)
  const walletAddress = (req.query.telegramId as string);
  const claim = await Claim.findOne({ telegramId:walletAddress });
  
  if (!claim) {
    return res.json({ claimed: false });
  }
  res.json({ claimed: true, txHash: claim.txHash, claimedAt: claim.claimedAt });
};
