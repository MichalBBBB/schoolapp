import {forwardRef} from 'react';
import {Image, Pressable, View} from 'react-native';
import {BasicText} from '../basicViews/BasicText';
import React from 'react';
import {BasicIcon} from '../basicViews/BasicIcon';

interface SettingsItemProps {
  text: string;
  rightText?: string;
  onPress?: () => void;
  showArrow?: boolean;
}

export const SettingsItem = forwardRef<View, SettingsItemProps>(
  (props, ref) => {
    const {text, onPress, rightText, showArrow = true} = props;
    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <BasicText>{text}</BasicText>
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
