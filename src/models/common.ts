import mongoose, { Schema, Document } from 'mongoose';

export interface ICheckbox extends Document {
  title: string;
  isDone: boolean;
}

export const CheckboxSchema = new Schema<ICheckbox>({
  title: {type: String, required: true},
  isDone: {type: Boolean, required: true},
})

CheckboxSchema.pre<ICheckbox>('save', function (next) {
  if (!this._id) {
    this._id = new mongoose.Types.ObjectId();
  }
  next();
});


export default mongoose.model<ICheckbox>('Checkbox', CheckboxSchema);
