import { memo } from 'react';
import { useDarkMode } from '@shared/lib';
import { Icon } from '..';

interface CompletionIconProps {
  completed: boolean;
}

type IconProps =
  | { name: 'circleFilled'; fill: string }
  | { name: 'circleEmpty'; stroke: string };

export const CompletionIcon = memo(({ completed }: CompletionIconProps) => {
  const { fill } = useDarkMode();

  const iconProps: IconProps = completed
    ? { name: 'circleFilled', fill: fill }
    : { name: 'circleEmpty', stroke: fill };

  return <Icon {...iconProps} />;
});
