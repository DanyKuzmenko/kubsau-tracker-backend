import express, { Router } from 'express';
import Controller from '../controllers/card';
import { validateCard } from '../middleware/cardValidation';
import { cardSchema, updateCardSchema } from '../schemas/card';

const router: Router = express.Router();

router.get('/cards', Controller.getCards);
router.post('/cards', validateCard(cardSchema), Controller.createCard);
router.put('/cards', validateCard(updateCardSchema), Controller.updateCard);
router.delete('/cards', Controller.deleteCard);

export default router;
