import { memo } from 'react';
import { iconsNames } from './IconsNames';

type IconName = keyof typeof iconsNames;

interface IconProps {
  name: IconName;
  size?: number;
  fill?: string;
  stroke?: string;
  ariaLabel?: string;
}

export const Icon = memo((props: IconProps) => {
  const { name, stroke, ariaLabel, fill = 'none', size = 24 } = props;

  const IconComponent = iconsNames[name];

  return (
    <IconComponent
      width={size}
      height={size}
      fill={fill}
      stroke={stroke}
      aria-label={ariaLabel}
      className='shrink-0'
    />
  );
});
