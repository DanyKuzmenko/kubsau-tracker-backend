import { Request, Response } from 'express';
import CardModel from '../models/card';

const Controller = {
  getCards: async (req: Request, res: Response): Promise<void> => {
    try {
      const cards = await CardModel.find();
      res.status(200).json(cards);
    } catch (err: any) {
      console.log('err => ', err);
      res.status(500).json({ err: err.message });
    }
  },

  createCard: async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, date, checkboxes, description, kubsauInfo } = req.body;

      const newCard = new CardModel({
        title,
        date,
        checkboxes,
        description,
        kubsauInfo,
      });

      await newCard.save();

      res.status(201).json(newCard);
    } catch (err: any) {
      console.error('err => ', err);
      res.status(500).json({ err: err.message });
    }
  },

  updateCard: async (req: Request, res: Response) => {
    try {
      const cardId = req.query.cardId;
      const updatedCardData = req.body;

      const updatedCard = await CardModel.findByIdAndUpdate(cardId, updatedCardData, { new: true });

      if (!updatedCard) {
        return res.status(404).json({ message: 'Card not found' });
      }

      res.status(201).json(updatedCard);
    } catch (err: any) {
      console.error('err => ', err);
      res.status(500).json({ err: err.message });
    }
  },

  deleteCard: async (req: Request, res: Response) => {
    try {
      const cardId = req.query.cardId;

      const deletedCard = await CardModel.findByIdAndRemove(cardId);

      if (!deletedCard) {
        return res.status(404).json({ message: 'Card not found' });
      }

      res.status(201).json(deletedCard);
    } catch (err: any) {
      console.error('err => ', err);
      res.status(500).json({ err: err.message });
    }
  }
};

export default Controller;
