import { COLORS, Icon } from '..';

interface CompletionIconProps {
  completed: boolean;
}

type IconProps =
  | { name: 'circleFilled'; fill: string }
  | { name: 'circleEmpty'; stroke: string };

export const CompletionIcon = ({ completed }: CompletionIconProps) => {
  const iconProps: IconProps = completed
    ? { name: 'circleFilled', fill: COLORS.ACCENT }
    : { name: 'circleEmpty', stroke: COLORS.ACCENT };

  return <Icon {...iconProps} />;
};
