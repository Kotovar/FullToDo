import {
  CardItemDrag,
  CardItemDrop,
  CardItemNormal,
} from './wrapperComponents';

export const Wrappers = {
  draggable: CardItemDrag,
  droppable: CardItemDrop,
  normal: CardItemNormal,
} as const;
