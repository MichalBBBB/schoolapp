import React, {forwardRef} from 'react';
import {View, ViewProps} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {ColorsObject, SpacingObject} from '../../types/Theme';

export interface BasicCardProps extends ViewProps {
  backgroundColor?: keyof ColorsObject;
  borderRadius?: number;
  spacing?: keyof SpacingObject;
}

export const BasicCard = forwardRef<View, BasicCardProps>((props, ref) => {
  const {
    backgroundColor = 'cardView',
    borderRadius = 15,
    children,
    spacing = 's',
    style,
    ...restProps
  } = props;
  const [theme] = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: theme.colors[backgroundColor],
          borderRadius,
          padding: theme.spacing[spacing],
        },
        style,
      ]}
      {...restProps}>
      {children}
    </View>
  );
});
