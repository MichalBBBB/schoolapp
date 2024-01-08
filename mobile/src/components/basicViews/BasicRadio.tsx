import React from 'react';
import {Pressable, View, ViewProps} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {ColorsObject} from '../../types/Theme';

interface BasicRadioProps extends ViewProps {
  toggled: boolean;
  onToggle?: (toggled: boolean) => void;
  color?: keyof ColorsObject;
}

export const BasicRadio: React.FC<BasicRadioProps> = ({
  toggled,
  onToggle,
  style,
  color = 'primary',
  ...rest
}) => {
  const [theme] = useTheme();
  return (
    <Pressable
      disabled={!onToggle}
      onPress={() => {
        onToggle?.(!toggled);
      }}
      style={[
        style,
        {
          alignItems: 'center',
          justifyContent: 'center',
          height: 20,
          width: 20,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: theme.colors[color],
          backgroundColor: 'rgba(0,0,0,0)',
        },
      ]}>
      {toggled && (
        <View
          style={{
            height: 12,
            width: 12,
            backgroundColor: theme.colors[color],
            borderRadius: 6,
          }}
        />
      )}
    </Pressable>
  );
};
