import http from 'http';
import { MockTaskRepository } from '../repositories/MockTaskRepository';
import { ALL_TASKS } from '../../data/task';

const taskRepo = new MockTaskRepository(ALL_TASKS);

export const getAllTasks = async (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>,
) => {
  try {
    const tasks = await taskRepo.getAllTasks();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(tasks));
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify(error));
  }
};

export const getTasksByNotepad = async (
  id: string,
  res: http.ServerResponse<http.IncomingMessage>,
) => {
  try {
    const tasks = await taskRepo.getTasksByNotebook(id);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(tasks));
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify(error));
  }
};

export const getTasksWithDueDate = async (
  date: Date,
  res: http.ServerResponse<http.IncomingMessage>,
) => {
  try {
    const tasks = await taskRepo.getTasksWithDueDate(date);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(tasks));
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify(error));
  }
};
