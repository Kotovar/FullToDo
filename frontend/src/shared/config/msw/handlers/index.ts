import { notepadHandlers } from './notepad';
import { taskHandlers } from './task';

export const handlers = [...notepadHandlers, ...taskHandlers];
