import express, { Router } from 'express';
import Controller from '../controllers/groups';

const router: Router = express.Router();

router.get('/groups', Controller.getGroups);

export default router;
