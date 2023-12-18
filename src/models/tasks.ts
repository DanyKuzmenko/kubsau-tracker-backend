import mongoose, { Document, Schema, Types } from 'mongoose';
import { ICheckbox } from './common';

export interface ITeachers {
  id: string;
  name: string;
  link?: string;
  isOnline: boolean;
  room: string;
  online?: string;
}

export interface ITask extends Document {
  title: string;
  subject: string;
  teachers: ITeachers[];
  isDone: boolean;
  deadline: Date;
  description: string;
  checkboxes: ICheckbox[];
  lessonId: Types.ObjectId;
}

const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  teachers: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      link: { type: String },
      isOnline: { type: Boolean, required: true },
      room: { type: String, required: true },
      online: { type: String },
    },
  ],
  isDone: { type: Boolean, required: true },
  deadline: { type: Date, required: true },
  description: { type: String, required: true },
  checkboxes: [{ type: Schema.Types.ObjectId, ref: 'Checkbox' }],
  lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
});

TaskSchema.pre<ITask>('save', function (next) {
  if (!this._id) {
    this._id = new mongoose.Types.ObjectId();
  }
  next();
});

const TaskModel = mongoose.model<ITask>('Task', TaskSchema);

export default TaskModel;
