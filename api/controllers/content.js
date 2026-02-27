import * as contentModel from "../models/content.js";

export const index = async (req, res, next) => {
  try {
    const content = await contentModel.selectAll();
    
    if (!content) {
      res.status(500);
      return next({ message: "Klaida gaunant turinį" });
    }
    
    const parsedContent = content.map(item => ({
      ...item,
      data: typeof item.data === 'string' ? JSON.parse(item.data) : (item.data || {})
    }));
    
    res.json(parsedContent);
  } catch (err) {
    res.status(500);
    next({ message: "Serverio klaida", error: err.message });
  }
};

export const getBySection = async (req, res, next) => {
  try {
    const content = await contentModel.selectBySection(req.params.section);
    
    if (!content) {
      res.status(404);
      return next({ message: "Sekcija nerasta" });
    }
    
    content.data = typeof content.data === 'string' ? JSON.parse(content.data) : (content.data || {});
    
    res.json(content);
  } catch (err) {
    res.status(500);
    next({ message: "Serverio klaida" });
  }
};

export const show = async (req, res, next) => {
  try {
    const content = await contentModel.selectById(req.params.id);
    
    if (!content) {
      res.status(404);
      return next({ message: "Turinys nerastas" });
    }
    
    // Parse JSON data field
    content.data = content.data ? JSON.parse(content.data) : {};
    
    res.json(content);
  } catch (err) {
    res.status(500);
    next({ message: "Serverio klaida" });
  }
};

// POST create new content section
export const store = async (req, res, next) => {
  try {
    if (!req.body.section) {
      res.status(400);
      return next({ message: "Sekcijos pavadinimas privalomas" });
    }
    
    // Add image path if file was uploaded
    const data = { ...req.body };
    if (req.file) {
      data.image = `/images/content/${req.file.filename}`;
    }
    
    const contentId = await contentModel.insert(data);
    
    if (!contentId) {
      res.status(500);
      return next({ message: "Klaida kuriant turinį" });
    }
    
    res.status(201).json({ id: contentId, message: "Turinys sėkmingai sukurtas" });
  } catch (err) {
    res.status(500);
    next({ message: "Serverio klaida" });
  }
};

// PUT update content
export const update = async (req, res, next) => {
  try {
    // Add image path if file was uploaded
    const data = { ...req.body };
    if (req.file) {
      data.image = `/images/content/${req.file.filename}`;
    }
    
    const success = await contentModel.update(req.params.id, data);
    
    if (!success) {
      res.status(500);
      return next({ message: "Klaida atnaujinant turinį" });
    }
    
    res.json({ message: "Turinys sėkmingai atnaujintas" });
  } catch (err) {
    res.status(500);
    next({ message: "Serverio klaida" });
  }
};

// DELETE content section
export const destroy = async (req, res, next) => {
  try {
    const success = await contentModel.destroy(req.params.id);
    
    if (!success) {
      res.status(500);
      return next({ message: "Klaida trinant turinį" });
    }
    
    res.json({ message: "Turinys sėkmingai ištrintas" });
  } catch (err) {
    res.status(500);
    next({ message: "Serverio klaida" });
  }
};
