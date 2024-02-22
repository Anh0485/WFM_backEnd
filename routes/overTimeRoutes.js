import express from "express";
import { protect } from "../middleware/authMiddleware";
import { createdOT, getAllOT,aprrovedRequest, deleteOT } from "../controller/overTimeController";
const router = express.Router();

router.post("/createdOT", protect, createdOT);
router.get("/", protect, getAllOT);
router.put("/approvedRequest/:id",protect,aprrovedRequest)
router.route("/:id").delete(protect,deleteOT)

export default router;