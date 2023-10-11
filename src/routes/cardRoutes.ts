import express, { Router } from 'express';
import Card from '../models/card';

const router: Router = express.Router();

router.get('/cards', async (req, res) => {
  try {
    const cards = await Card.find()
    res.status(201).json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ message: 'An server error occurred while fetching cards' });
  }
})

router.post('/cards', async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ message: 'Description is required' });
    }

    const newCard = new Card({ description });

    await newCard.save();

    res.status(201).json(newCard);
  } catch (error) {
    console.error('Error creating a card:', error);
    res.status(500).json({ message: 'An server error occurred while creating a card' });
  }
});

export default router;
