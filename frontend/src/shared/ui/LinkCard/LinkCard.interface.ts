import type { ComponentPropsWithoutRef, JSX } from 'react';

export interface LinkCardProps extends ComponentPropsWithoutRef<'li'> {
  path: string;
  cardTitle: string;
  header?: JSX.Element;
  body?: JSX.Element;
  isEditing?: boolean;
  linkClassName?: string;
  handleClickRename: () => void;
  handleClickDelete: () => void;
  handleLinkClick?: () => void;
  onSaveTitle?: (newTitle: string) => Promise<string | void>;
}
