import {forwardRef} from 'react';
import {Image, Pressable, View} from 'react-native';
import {BasicText} from '../basicViews/BasicText';
import React from 'react';
import {BasicIcon} from '../basicViews/BasicIcon';
import {ColorsObject} from '../../types/Theme';

interface SettingsItemProps {
  text: string;
  rightText?: string;
  onPress?: () => void;
  showArrow?: boolean;
  textColor?: keyof ColorsObject;
}

export const SettingsItem = forwardRef<View, SettingsItemProps>(
  (props, ref) => {
    const {
      text,
      onPress,
      rightText,
      showArrow = true,
      textColor = 'primary',
    } = props;
    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 6,
        }}>
        <BasicText color={textColor}>{text}</BasicText>
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
