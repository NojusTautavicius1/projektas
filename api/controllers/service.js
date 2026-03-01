import * as serviceModel from "../models/service.js";
import { autoBackup } from "../utils/auto-backup.js";

// Get all services (admin)
export const index = async (req, res, next) => {
  let services = await serviceModel.selectAll();
  res.json(services);
};

// Get active services only (public)
export const active = async (req, res, next) => {
  let services = await serviceModel.selectActive();
  res.json(services);
};

// Get one service
export const show = async (req, res, next) => {
  let service = await serviceModel.selectById(req.params.id);

  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }

  res.json(service);
};

// Create new service
export const store = async (req, res, next) => {
  if (!req.body.name || !req.body.price || !req.body.description) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  let serviceId = await serviceModel.insert(req.body);

  if (!serviceId) {
    return res.status(500).json({ message: "Error creating service" });
  }

  autoBackup().catch(err => console.error('Backup error:', err));

  res.status(201).json({ id: serviceId });
};

// Update service
export const update = async (req, res, next) => {
  if (!req.body.name || !req.body.price || !req.body.description) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  let success = await serviceModel.update(req.params.id, req.body);

  if (!success) {
    return res.status(500).json({ message: "Error updating service" });
  }

  autoBackup().catch(err => console.error('Backup error:', err));

  res.json({ message: "Service updated" });
};

// Delete service
export const destroy = async (req, res, next) => {
  let success = await serviceModel.destroy(req.params.id);
  
  if (!success) {
    return res.status(500).json({ message: "Error deleting service" });
  }

  autoBackup().catch(err => console.error('Backup error:', err));

  res.json({ message: "Service deleted" });
};
