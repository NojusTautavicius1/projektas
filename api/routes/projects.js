import express from 'express';
import * as projectController from "../controllers/project.js";
import upload from '../middleware/upload.js';
const router = express.Router();

// projektų sąrašas
router.get("/", projectController.index);

// projekto informacija pagal ID
router.get("/:id", projectController.show);

// projekto kūrimas
router.post("/", upload.single('image'), projectController.store);

// projekto atnaujinimas pagal ID
router.put("/:id", upload.single('image'), projectController.update);

// projekto ištrinimas pagal ID
router.delete("/:id", projectController.destroy);

export default router;