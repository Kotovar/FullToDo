import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { getNotepadIdFromPath } from './utils';
import { isString } from '@shared/lib';

type HoveredState = 'idle' | 'validMove' | 'invalidMove';

type CardItemDragProps = PropsWithChildren<{
  className?: string;
  notepadId: string;
  taskId: string;
}>;

type CardItemDropProps = PropsWithChildren<{
  className?: string;
  path: string;
  handleMove?: (newNotepadId: string, taskId: string) => void;
}>;

export const CardItemDrag = ({
  children,
  className,
  notepadId,
  taskId,
}: CardItemDragProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return draggable({
      element: el,
      getInitialData: () => ({ notepadId, taskId }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  }, [notepadId, taskId]);

  return (
    <div
      ref={ref}
      className={clsx(
        'duration-200',
        dragging ? 'opacity-50' : 'opacity-100',
        className,
      )}
    >
      {children}
    </div>
  );
};

export const CardItemDrop = ({
  children,
  className,
  path,
  handleMove,
}: CardItemDropProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<HoveredState>('idle');
  const targetNotepadId = getNotepadIdFromPath(path);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,
      onDragEnter: ({ source }) => {
        const sourceId = source.data.notepadId;
        if (!sourceId || !targetNotepadId) return;
        setState(sourceId === targetNotepadId ? 'invalidMove' : 'validMove');
      },
      onDragLeave: () => setState('idle'),
      onDrop: ({ source }) => {
        setState('idle');
        const taskId = source.data.taskId;

        if (!taskId || !targetNotepadId || !isString(taskId)) return;

        if (handleMove) {
          handleMove(targetNotepadId, taskId);
        }
      },
    });
  }, [handleMove, targetNotepadId]);

  return (
    <div
      ref={ref}
      className={clsx(
        'duration-200',
        state === 'validMove' && 'bg-bg-second ring-accent ring-2',
        state === 'invalidMove' && 'bg-grey-light ring-grey ring-1',
        className,
      )}
    >
      {children}
    </div>
  );
};

export const Wrappers = {
  draggable: CardItemDrag,
  droppable: CardItemDrop,
  normal: ({
    children,
    className,
  }: PropsWithChildren<{ className?: string }>) => (
    <div className={className}>{children}</div>
  ),
} as const;
