import * as featureBoxModel from "../models/featureBox.js";

// GET all feature boxes
export const index = async (req, res, next) => {
  try {
    const boxes = await featureBoxModel.selectAll();
    
    if (!boxes) {
      res.status(500);
      return next({ message: "Klaida gaunant feature boxes" });
    }
    
    res.json(boxes);
  } catch (err) {
    res.status(500);
    next({ message: "Serverio klaida", error: err.message });
  }
};

// GET feature boxes by section
export const getBySection = async (req, res, next) => {
  try {
    const boxes = await featureBoxModel.selectBySection(req.params.section);
    
    if (!boxes) {
      res.status(500);
      return next({ message: "Klaida gaunant feature boxes" });
    }
    
    res.json(boxes);
  } catch (err) {
    res.status(500);
    next({ message: "Serverio klaida" });
  }
};

// GET feature box by ID
export const show = async (req, res, next) => {
  try {
    const box = await featureBoxModel.selectById(req.params.id);
    
    if (!box) {
      res.status(404);
      return next({ message: "Feature box nerastas" });
    }
    
    res.json(box);
  } catch (err) {
    res.status(500);
    next({ message: "Serverio klaida" });
  }
};

// POST create new feature box
export const store = async (req, res, next) => {
  try {
    if (!req.body.section || !req.body.label) {
      res.status(400);
      return next({ message: "Sekcija ir pavadinimas privalomi" });
    }
    
    const boxId = await featureBoxModel.insert(req.body);
    
    if (!boxId) {
      res.status(500);
      return next({ message: "Klaida kuriant feature box" });
    }
    
    res.status(201).json({ id: boxId, message: "Feature box sėkmingai sukurtas" });
  } catch (err) {
    res.status(500);
    next({ message: "Serverio klaida" });
  }
};

// PUT update feature box
export const update = async (req, res, next) => {
  try {
    const success = await featureBoxModel.update(req.params.id, req.body);
    
    if (!success) {
      res.status(500);
      return next({ message: "Klaida atnaujinant feature box" });
    }
    
    res.json({ message: "Feature box sėkmingai atnaujintas" });
  } catch (err) {
    res.status(500);
    next({ message: "Serverio klaida" });
  }
};

// DELETE feature box
export const destroy = async (req, res, next) => {
  try {
    const success = await featureBoxModel.destroy(req.params.id);
    
    if (!success) {
      res.status(500);
      return next({ message: "Klaida trinant feature box" });
    }
    
    res.json({ message: "Feature box sėkmingai ištrintas" });
  } catch (err) {
    res.status(500);
    next({ message: "Serverio klaida" });
  }
};

// PUT update display order
export const updateOrder = async (req, res, next) => {
  try {
    if (!req.body.updates || !Array.isArray(req.body.updates)) {
      res.status(400);
      return next({ message: "Neteisingi duomenys" });
    }
    
    const success = await featureBoxModel.updateOrder(req.body.updates);
    
    if (!success) {
      res.status(500);
      return next({ message: "Klaida atnaujinant tvarką" });
    }
    
    res.json({ message: "Tvarka sėkmingai atnaujinta" });
  } catch (err) {
    res.status(500);
    next({ message: "Serverio klaida" });
  }
};
