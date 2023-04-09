import React from 'react';
import {Image, ImageProps, ImageSourcePropType} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {ColorsObject} from '../../types/Theme';

interface BasicIconProps extends ImageProps {
  color?: keyof ColorsObject;
}

export const BasicIcon: React.FC<BasicIconProps> = ({
  color = 'icon',
  style,
  ...props
}) => {
  const [theme] = useTheme();
  return <Image {...props} style={[style, {tintColor: theme.colors[color]}]} />;
};
