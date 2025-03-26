import { Router, RequestHandler } from 'express';
import Claim from '../models/Claim';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();
import { getStatus, postClaim } from '../controllers/claimController';



router.post('/', postClaim as unknown as RequestHandler);

router.get('/status',getStatus as unknown as RequestHandler);


router.get('/:walletAddress', (async (req, res) => {
  const record = await Claim.findOne({ walletAddress: req.params.walletAddress });
  if (!record) return res.status(404).json({ message: 'Not found' });
  res.json(record);
}) as RequestHandler);

export default router;
