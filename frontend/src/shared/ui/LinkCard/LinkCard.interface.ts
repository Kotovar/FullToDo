import type { ComponentPropsWithoutRef, JSX } from 'react';

export interface LinkCardProps extends ComponentPropsWithoutRef<'li'> {
  path: string;
  cardTitle: string;
  currentModalId: string;
  header?: JSX.Element;
  body?: JSX.Element;
  isEditing?: boolean;
  linkClassName?: string;
  handleModalId: (id: string) => void;
  handleClickRename: () => void;
  handleClickDelete: () => void;
  handleLinkClick?: () => void;
  onSaveTitle?: (newTitle: string) => Promise<string | void>;
}
