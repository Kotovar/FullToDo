export const createSubtask = (title: string) => {
  return {
    title,
    isCompleted: false,
    _id: globalThis.crypto.randomUUID(),
  };
};
