import { Router, RequestHandler } from 'express';
import { addWhitelistUser } from '../controllers/whitelistController';
import { getMerkleRoot } from '../utils/merkle';

const router = Router();

router.post('/', addWhitelistUser as unknown as RequestHandler);
router.get('/root', ((_req, res) => {
  res.json({ merkleRoot: getMerkleRoot() });
}) as RequestHandler);

export default router;
