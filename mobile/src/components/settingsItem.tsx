import {forwardRef} from 'react';
import {Image, Pressable, View} from 'react-native';
import {BasicText} from './basicViews/BasicText';

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
        <Image
          source={require('../../assets/Chevron-right.png')}
          style={{height: 15, width: 15}}
        />
      </Pressable>
    );
  },
);
