import mongoose, { Document, Schema, Types } from 'mongoose';
import { ICheckbox } from './common';

export interface ITask extends Document {
  title: string;
  subject: string;
  teacher: string;
  isDone: boolean;
  deadline: Date;
  description: string;
  checkboxes: ICheckbox[]
  lessonId: Types.ObjectId;
}

const TaskSchema = new Schema<ITask>({
  title: {type: String, required: true},
  subject: {type: String, required: true},
  teacher: {type: String, required: true},
  isDone: {type: Boolean, required: true},
  deadline: {type: Date, required: true},
  description: {type: String, required: true},
  checkboxes: [{ type: Schema.Types.ObjectId, ref: 'Checkbox' }],
  lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true }
});

TaskSchema.pre<ITask>('save', function (next) {
  if (!this._id) {
    this._id = new mongoose.Types.ObjectId();
  }
  next();
});

const TaskModel = mongoose.model<ITask>('Task', TaskSchema);

export default TaskModel;
