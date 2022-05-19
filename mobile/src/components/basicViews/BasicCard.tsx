import React from 'react';
import {View} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';

interface BasicCardProps {
  backgroundColor?: string | undefined;
  borderRadius?: number | undefined;
  padding?: number | undefined;
}

export const BasicCard: React.FC<BasicCardProps> = ({
  backgroundColor,
  borderRadius = 15,
  children,
  padding = 10,
}) => {
  const [theme] = useTheme();
  return (
    <View
      style={{
        backgroundColor: backgroundColor || theme.colors.card,
        borderRadius,
        padding,
      }}>
      {children}
    </View>
  );
};
