import express, { Router } from 'express';
import Controller from '../controllers/card';
import { validateCard } from '../middleware/cardValidation';

const router: Router = express.Router();

router.get('/cards', Controller.getCards)
router.post('/cards', validateCard, Controller.createCard);

export default router;
