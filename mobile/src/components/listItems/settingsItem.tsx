import {forwardRef} from 'react';
import {Image, Pressable, View, ViewStyle} from 'react-native';
import {BasicText, BasicTextProps} from '../basicViews/BasicText';
import React from 'react';
import {BasicIcon} from '../basicViews/BasicIcon';
import {ColorsObject} from '../../types/Theme';

interface SettingsItemProps {
  text: string;
  rightText?: string;
  onPress?: () => void;
  showArrow?: boolean;
  textColor?: keyof ColorsObject;
  leftTextProps?: BasicTextProps;
  style?: ViewStyle;
}

export const SettingsItem = forwardRef<View, SettingsItemProps>(
  (props, ref) => {
    const {
      text,
      onPress,
      rightText,
      showArrow = true,
      textColor = 'primary',
      leftTextProps,
      style,
    } = props;
    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 8,
            paddingVertical: 8,
          },
          style,
        ]}>
        <BasicText color={textColor} {...leftTextProps} textVariant="menuItem">
          {text}
        </BasicText>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <BasicText color="textSecondary" style={{marginRight: 5}}>
            {rightText}
          </BasicText>
          {showArrow && (
            <BasicIcon
              source={require('../../../assets/Chevron-right.png')}
              style={{height: 15, width: 15}}
            />
          )}
        </View>
      </Pressable>
    );
  },
);
