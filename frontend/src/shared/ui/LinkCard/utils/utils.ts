export const getNotepadIdFromPath = (path: string): string | null => {
  const parts = path.split('/');
  const index = parts.indexOf('notepads');

  if (index !== -1 && parts.length > index + 1) {
    return parts[index + 1];
  }

  return null;
};
