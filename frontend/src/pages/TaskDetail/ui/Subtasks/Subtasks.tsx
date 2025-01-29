import type { ComponentPropsWithoutRef } from 'react';
import { COLORS, Icon } from '@shared/ui/Icon';
import type { Subtask } from '@entities/Task';

interface Props extends ComponentPropsWithoutRef<'ul'> {
  subtasks: Subtask[];
}

export const Subtasks = (props: Props) => {
  const { subtasks, ...rest } = props;

  return (
    <ul className='flex list-none flex-col' {...rest}>
      {subtasks.map(({ completed, title }, i) => {
        return (
          <li
            key={i}
            className='odd:bg-bg-second even:bg-grey-light grid grid-cols-[1rem_1fr_1rem] items-center gap-4 p-2'
          >
            <span>
              {completed ? (
                <Icon name='circleFilled' fill={COLORS.ACCENT} />
              ) : (
                <Icon name='circleEmpty' stroke={COLORS.ACCENT} />
              )}
            </span>
            <span>{title}</span>
            <button type='button'>
              <Icon name='cross' fill={COLORS.ACCENT} />
            </button>
          </li>
        );
      })}
    </ul>
  );
};
