import express, { Router } from 'express';
import Controller from '../controllers/schedule';

const router: Router = express.Router();

router.get('/schedule/:groupID', Controller.getSchedule);

export default router;
