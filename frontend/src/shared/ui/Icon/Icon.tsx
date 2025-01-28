import { iconsNames } from './IconsNames';

interface Props {
  name: keyof typeof iconsNames;
  size?: number;
  fill?: string;
  stroke?: string;
}

export const Icon = (props: Props) => {
  const { name, fill = 'none', stroke, size = 24 } = props;

  const IconComponent = iconsNames[name];

  return (
    <IconComponent width={size} height={size} fill={fill} stroke={stroke} />
  );
};
