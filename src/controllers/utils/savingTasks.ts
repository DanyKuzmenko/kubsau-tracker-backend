import CheckboxModel from '../../models/common';
import TaskModel, { ITask } from '../../models/tasks';

export const createTask = async (task: ITask): Promise<ITask> => {
  const checkboxes = task.checkboxes;

  const createdCheckboxes = await Promise.all(
    checkboxes.map(async (checkbox: { title: string; isDone: boolean }) => {
      return await CheckboxModel.create(checkbox);
    })
  );

  return await TaskModel.create({
    title: task.title,
    subject: task.subject,
    teacher: task.teacher,
    isDone: task.isDone,
    deadline: task.deadline,
    description: task.description,
    checkboxes: createdCheckboxes,
    lessonId: task.lessonId,
  });
}
