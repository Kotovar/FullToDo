import type { ComponentPropsWithoutRef, JSX } from 'react';

type LinkCardMode = 'normal' | 'draggable' | 'droppable';

export interface LinkCardProps extends ComponentPropsWithoutRef<'li'> {
  path: string;
  cardTitle: string;
  header?: JSX.Element;
  body?: JSX.Element;
  isEditing?: boolean;
  linkClassName?: string;
  mode?: LinkCardMode;
  taskId?: string;
  handleClickRename: () => void;
  handleClickDelete: () => void;
  handleLinkClick?: () => void;
  onSaveTitle?: (newTitle: string) => Promise<string | void>;
}
