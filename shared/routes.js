"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUTES = void 0;
exports.ROUTES = {
    NOTEPADS: '/notepad',
    ALL_TASKS: '/notepad/all',
    TODAY_TASKS: '/notepad/today',
    TASK: '/task',
    NOTEPAD_ID: '/notepad/:notepadId',
    TASK_ID: '/notepad/:notepadId/task/:taskId',
    getNotepadPath: (id) => `${exports.ROUTES.NOTEPADS}/${id}`,
    getTaskDetailPath: (notepadPath, taskId) => `${notepadPath}${exports.ROUTES.TASK}/${taskId}`,
};
