import { IconName } from '@shared/config';
import { iconsNames } from './IconsNames';

interface IconProps {
  name: IconName;
  size?: number;
  fill?: string;
  stroke?: string;
}

export const Icon = (props: IconProps) => {
  const { name, fill = 'none', stroke, size = 24 } = props;

  const IconComponent = iconsNames[name];

  return (
    <IconComponent width={size} height={size} fill={fill} stroke={stroke} />
  );
};
