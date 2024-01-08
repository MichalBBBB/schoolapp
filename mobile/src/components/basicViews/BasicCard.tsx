import React, {forwardRef} from 'react';
import {View, ViewProps} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {
  ColorsObject,
  SpacingObject,
  SubjectColorsObject,
} from '../../types/Theme';

export interface BasicCardProps extends ViewProps {
  subjectColor?: keyof SubjectColorsObject;
  borderWidth?: number;
  backgroundColor?: keyof ColorsObject;
  borderColor?: keyof ColorsObject;
  borderRadius?: number;
  spacing?: keyof SpacingObject;
  marginBottom?: number;
  gap?: number;
}

export const BasicCard = forwardRef<View, BasicCardProps>((props, ref) => {
  const {
    backgroundColor = 'modal',
    borderRadius = 15,
    children,
    spacing = 's',
    style,
    marginBottom,
    gap,
    subjectColor,
    borderColor,
    borderWidth,
    ...restProps
  } = props;
  const [theme] = useTheme();

  const content = Array.isArray(children)
    ? children.map((item, index) => {
        if (index !== children.length - 1 && item) {
          return (
            <View style={{marginBottom: gap}} key={index}>
              {item}
            </View>
          );
        } else {
          return item;
        }
      })
    : children;

  return (
    <View
      style={[
        {
          backgroundColor: subjectColor
            ? theme.subjectColors[subjectColor].secondary
            : theme.colors[backgroundColor],
          borderRadius,
          borderWidth,
          borderColor: subjectColor
            ? theme.subjectColors[subjectColor].primary
            : borderColor
            ? theme.colors[borderColor]
            : undefined,
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
