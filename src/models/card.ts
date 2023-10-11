import mongoose, { Schema, Document } from 'mongoose';

export interface ICard extends Document {
  description: string;
}

const cardSchema = new Schema<ICard>({
  description: { type: String, required: true },
});

const CardModel = mongoose.model<ICard>('Card', cardSchema);

export default CardModel;
