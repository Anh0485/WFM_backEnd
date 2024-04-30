import express from 'express';
const router = express.Router();

import { getAllChannel } from '../controller/channelController';
import { protect } from '../middleware/authMiddleware';

router.route("/").get(protect, getAllChannel);

export default router;