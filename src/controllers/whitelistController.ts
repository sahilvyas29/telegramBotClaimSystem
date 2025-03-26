import { Request, Response } from 'express';
import Whitelist from '../models/Whitelist';
import { updateMerkleRootOnChain } from '../services/merkleService';

export const addWhitelistUser = async (req: Request, res: Response) => {
  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ success: false, error: "Missing walletAddress" });
  }

  try {
    const newUser = await Whitelist.create({
      walletAddress: walletAddress.toLowerCase(),
    });

    const merkleRoot = await updateMerkleRootOnChain();
    return res.status(201).json({ success: true, message: "User added to whitelist", merkleRoot });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, error: "Address already whitelisted" });
    }
    console.error("Error adding to whitelist:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
