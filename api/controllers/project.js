import * as projectModel from "../models/project.js";
import { autoBackup } from "../utils/auto-backup.js";

// Gauti visus projektus
export const index = async (req, res, next) => {
  let projects = await projectModel.selectAll();
  res.json(projects);
};

// Gauti vieną projektą
export const show = async (req, res, next) => {
  let project = await projectModel.selectById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: "404" });
  }

  res.json(project);
};

// Sukurti naują projektą
export const store = async (req, res, next) => {
  if (!req.body.title || !req.body.description) {
    return res.status(400).json({ message: "Trūksta duomenų" });
  }

  if (req.file) {
    req.body.image = `/images/projects/${req.file.filename}`;
  }

  let projectId = await projectModel.insert(req.body);

  if (!projectId) {
    return res.status(500).json({ message: "Klaida kuriant projektą" });
  }

  autoBackup().catch(err => console.error('Backup error:', err));

  res.status(201).json({ id: projectId });
};

export const update = async (req, res, next) => {
  if (!req.body.title || !req.body.description) {
    return res.status(400).json({ message: "Trūksta duomenų" });
  }

  if (req.file) {
    req.body.image = `/images/projects/${req.file.filename}`;
  }

  let success = await projectModel.update(req.params.id, req.body);

  if (!success) {
    return res.status(500).json({ message: "Klaida atnaujinant projektą" });
  }

  autoBackup().catch(err => console.error('Backup error:', err));

  res.json({ message: "Projektas atnaujintas" });
};

export const destroy = async (req, res, next) => {
  let success = await projectModel.destroy(req.params.id);
  if (!success) {
    return res.status(500).json({ message: "Klaida trinant projektą" });
  }

  autoBackup().catch(err => console.error('Backup error:', err));

  res.json({ message: "Projektas ištrintas" });
};
