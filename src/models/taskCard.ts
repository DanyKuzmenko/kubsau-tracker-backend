import mongoose, { Document, Schema } from 'mongoose';
import { ITask } from './tasks';

export interface ITaskCard extends Document {
  date: Date;
  tasks: ITask[];
}

const TaskCardSchema = new Schema<ITaskCard>({
  date: {type: Date, required: true},
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
});

TaskCardSchema.pre<ITask>('save', function (next) {
  if (!this._id) {
    this._id = new mongoose.Types.ObjectId();
  }
  next();
});

const TaskCardModel = mongoose.model<ITaskCard>('TaskCard', TaskCardSchema);

export default TaskCardModel;
