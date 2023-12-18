import express, { Router } from 'express';
import Controller from '../controllers/tasks';

const router: Router = express.Router();

router.get('/tasks', Controller.getTaskCards);
router.get('/tasks/:lessonId', Controller.getTaskByLessonId);
router.post('/tasks', Controller.createTaskCard);
router.patch('/tasks/:lessonId', Controller.updateCardByLessonId);
router.post('/tasks/checkbox', Controller.createCheckbox);
router.patch('/tasks/checkbox/:checkboxId', Controller.updateCheckboxById);

export default router;
