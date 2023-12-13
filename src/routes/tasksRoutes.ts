import express, { Router } from 'express';
import Controller from '../controllers/tasks';

const router: Router = express.Router();

router.get('/task-cards', Controller.getTaskCards);
router.post('/task-cards', Controller.createTaskCard);


router.get('/tasks', Controller.getTasks);
router.post('/tasks', Controller.createTask);

export default router;
