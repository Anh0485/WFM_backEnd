import express from "express";
import { protect } from "../middleware/authMiddleware";
import { createdOT, getAllOT,reviewRequest, deleteOT } from "../controller/overTimeController";
const router = express.Router();

router.post("/createdOT", protect, createdOT);
router.get("/", protect, getAllOT);
router.put("/reviewRequest/:id",protect,reviewRequest)
router.route("/:id").delete(protect,deleteOT)

export default router;