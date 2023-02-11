import React, {forwardRef} from 'react';
import {View, ViewProps} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {ColorsObject, SpacingObject} from '../../types/Theme';

export interface BasicCardProps extends ViewProps {
  backgroundColor?: keyof ColorsObject;
  borderRadius?: number;
  spacing?: keyof SpacingObject;
  marginBottom?: number;
  gap?: number;
}

export const BasicCard = forwardRef<View, BasicCardProps>((props, ref) => {
  const {
    backgroundColor = 'accentBackground',
    borderRadius = 15,
    children,
    spacing = 's',
    style,
    marginBottom,
    gap,
    ...restProps
  } = props;
  const [theme] = useTheme();

  const content = Array.isArray(children)
    ? children.map((item, index) => {
        if (index !== children.length - 1) {
          return <View style={{marginBottom}}>{item}</View>;
        } else {
          return item;
        }
      })
    : children;

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors[backgroundColor],
          borderRadius,
          padding: theme.spacing[spacing],
          marginBottom,
        },
        style,
      ]}
      {...restProps}>
      {content}
    </View>
  );
});
