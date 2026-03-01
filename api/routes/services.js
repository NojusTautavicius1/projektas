import express from 'express';
import * as serviceController from "../controllers/service.js";
const router = express.Router();

// Get all services (admin)
router.get("/", serviceController.index);

// Get active services only (public)
router.get("/active", serviceController.active);

// Get service by ID
router.get("/:id", serviceController.show);

// Create service
router.post("/", serviceController.store);

// Update service
router.put("/:id", serviceController.update);

// Delete service
router.delete("/:id", serviceController.destroy);

export default router;
