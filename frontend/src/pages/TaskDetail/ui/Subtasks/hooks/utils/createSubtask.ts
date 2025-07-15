export const createSubtask = (title: string) => ({
  title,
  isCompleted: false,
  _id: globalThis.crypto.randomUUID(),
});
