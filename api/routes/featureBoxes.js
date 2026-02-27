import express from "express";
import * as featureBoxController from "../controllers/featureBox.js";
import { authenticate, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", featureBoxController.index);
router.get("/section/:section", featureBoxController.getBySection);
router.get("/:id", featureBoxController.show);

// Protected routes (admin only)
router.post("/", authenticate, adminOnly, featureBoxController.store);
router.put("/:id", authenticate, adminOnly, featureBoxController.update);
router.delete("/:id", authenticate, adminOnly, featureBoxController.destroy);
router.put("/order/update", authenticate, adminOnly, featureBoxController.updateOrder);

export default router;
