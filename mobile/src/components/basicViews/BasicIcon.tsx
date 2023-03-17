import React from 'react';
import {Image, ImageProps, ImageSourcePropType} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';

export const BasicIcon: React.FC<ImageProps> = ({style, ...props}) => {
  const [theme] = useTheme();
  return <Image {...props} style={[style, {tintColor: theme.colors.icon}]} />;
};
