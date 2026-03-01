import express from 'express';
import usersRouter from './users.js';
import projectsRouter from './projects.js';
import authRouter from './auth.js';
import contactRouter from './contact.js';
import contentRouter from './content.js';
import featureBoxesRouter from './featureBoxes.js';
import activityRouter from './activity.js';
import servicesRouter from './services.js';

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({message: 'Serveris veikia' });
});

// pajungiame auth maršrutus
router.use('/api/auth', authRouter);

// pajungiame contact maršrutus
router.use('/api/contact', contactRouter);

// Direct login/register routes for backward compatibility
import * as userController from '../controllers/auth.js';
router.post('/api/login', userController.authValidator(), userController.login);
router.post('/api/register', userController.registerValidator(), userController.register);

// pajungiame users maršrutus
router.use('/api/users', usersRouter);
router.use('/users', usersRouter);

// pajungiame projects maršrutus
router.use('/api/projects', projectsRouter);
router.use('/projects', projectsRouter);

// pajungiame content maršrutus
router.use('/api/content', contentRouter);

// pajungiame feature boxes maršrutus
router.use('/api/feature-boxes', featureBoxesRouter);

// pajungiame activity maršrutus
router.use('/api/activity', activityRouter);

// pajungiame services maršrutus
router.use('/api/services', servicesRouter);

export default router;