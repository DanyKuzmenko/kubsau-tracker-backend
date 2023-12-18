import express, { Router } from 'express';
import Controller from '../controllers/tasks';

const router: Router = express.Router();

router.get('/tasks', Controller.getTaskCards);
router.get('/tasks/:lessonId', Controller.getTaskByLessonId);
router.post('/tasks', Controller.createTaskCard);
router.patch('/tasks/:lessonId', Controller.updateCardByLessonId);
router.delete('/tasks/:lessonId', Controller.deleteTask);
router.post('/tasks/checkbox', Controller.createCheckbox);
router.patch('/tasks/checkbox/:checkboxId', Controller.updateCheckboxById);
router.delete('/tasks/checkbox/:checkboxId', Controller.deleteCheckbox);

export default router;
