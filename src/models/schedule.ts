import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson {
  name?: string;
  type?: string;
  teachers: {
    id: string;
    name: string;
    link?: string;
    isOnline: boolean;
    online?: string;
    room: string;
  }[];
}

export interface IClassInfo {
  number: number;
  start: string;
  finish: string;
  lessons: ILesson[] | [];
}

export interface IDayInfo {
  number: number;
  date: string;
  classes: IClassInfo[];
}

export interface IWeekInfo {
  number: number;
  days: IDayInfo[];
}

export interface ISchedule extends Document {
  id: string;
  type: string;
  name: string;
  lastRefresh: string;
  currentWeek: number;
  weeks: IWeekInfo[];
}

const lessonSchema = new mongoose.Schema<ILesson>({
  name: { type: String },
  type: { type: String },
  teachers: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      link: { type: String },
      isOnline: { type: Boolean, required: true },
      online: { type: String },
      room: { type: String, required: true },
    },
  ],
});

const classSchema = new mongoose.Schema<IClassInfo>({
  number: { type: Number, required: true },
  start: { type: String, required: true },
  finish: { type: String, required: true },
  lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson', required: false }],
});

const daySchema = new mongoose.Schema<IDayInfo>({
  number: { type: Number, required: true },
  date: { type: String, required: true },
  classes: [{ type: Schema.Types.ObjectId, ref: 'Class' }],
});

const weekSchema = new mongoose.Schema<IWeekInfo>({
  number: { type: Number, required: true },
  days: [{ type: Schema.Types.ObjectId, ref: 'Day' }],
});

const scheduleSchema = new Schema<ISchedule>({
  id: { type: String, required: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  lastRefresh: { type: String, required: true },
  currentWeek: { type: Number, required: true },
  weeks: [{ type: Schema.Types.ObjectId, ref: 'Week' }],
});

export const LessonModel = mongoose.model<ILesson>('Lesson', lessonSchema);
export const ClassModel = mongoose.model<IClassInfo>('Class', classSchema);
export const DayModel = mongoose.model<IDayInfo>('Day', daySchema);
export const WeekModel = mongoose.model<IWeekInfo>('Week', weekSchema);
export const ScheduleModel = mongoose.model<ISchedule>(
  'Schedule',
  scheduleSchema,
);
