import mongoose, { Schema, Document } from 'mongoose';

export interface ICard extends Document {
  title: string;
  date: Date;
  checkboxes?: {
    title: string;
    isActive: boolean;
  }[];
  description?: string;
  kubsauInfo: {
    id: string;
    subject: string;
    group: string;
    auditorium: string;
    teacher: string;
  };
}

const cardSchema = new Schema<ICard>({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  checkboxes: [
    {
      title: { type: String, required: true },
      isActive: { type: Boolean, required: true },
    },
  ],
  description: { type: String },
  kubsauInfo: {
    id: { type: String, required: true },
    subject: { type: String, required: true },
    group: { type: String, required: true },
    auditorium: { type: String, required: true },
    teacher: { type: String, required: true },
  },
});

const CardModel = mongoose.model<ICard>('Card', cardSchema);

export default CardModel;
