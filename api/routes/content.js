import express from "express";
import * as contentController from "../controllers/content.js";
import passport from "passport";
import { requireAdmin } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Public routes - anyone can read content
router.get("/", contentController.index);
router.get("/section/:section", contentController.getBySection);

// Protected routes - only authenticated admins can modify
router.get("/:id", 
  passport.authenticate("jwt", { session: false }), 
  requireAdmin,
  contentController.show
);

router.post("/", 
  passport.authenticate("jwt", { session: false }), 
  requireAdmin,
  upload.single('image'),
  contentController.store
);

router.put("/:id", 
  passport.authenticate("jwt", { session: false }), 
  requireAdmin,
  upload.single('image'),
  contentController.update
);

router.delete("/:id", 
  passport.authenticate("jwt", { session: false }), 
  requireAdmin,
  contentController.destroy
);

export default router;
