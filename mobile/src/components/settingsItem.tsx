import {forwardRef} from 'react';
import {Image, Pressable, View} from 'react-native';
import {BasicText} from './basicViews/BasicText';
import React from 'react';
import {BasicIcon} from './basicViews/BasicIcon';

interface SettingsItemProps {
  text: string;
  onPress?: () => void;
}

export const SettingsItem = forwardRef<View, SettingsItemProps>(
  (props, ref) => {
    const {text, onPress} = props;
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
        <BasicIcon
          source={require('../../assets/Chevron-right.png')}
          style={{height: 15, width: 15}}
        />
      </Pressable>
    );
  },
);
