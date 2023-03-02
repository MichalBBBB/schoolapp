import React, {useEffect} from 'react';
import {View} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {ColorsObject} from '../../types/Theme';
import {Modal} from '../modal';
import {BasicCard, BasicCardProps} from './BasicCard';

export interface BasicModalCardProps extends BasicCardProps {
  borderRadius?: number | undefined;
  isVisible: boolean;
  avoidKeyboard?: boolean | undefined;
  onBackdropPress?: (() => void) | undefined;
  alignCard: 'flex-end' | 'center' | 'flex-start' | undefined;
  shouldStretchWidth?: boolean;
}

export const BasicModalCard: React.FC<BasicModalCardProps> = ({
  children,
  isVisible,
  avoidKeyboard = false,
  onBackdropPress,
  alignCard = 'center',
  shouldStretchWidth = true,
  ...restProps
}) => {
  const [theme] = useTheme();
  return (
    <Modal
      // backdropTransitionOutTiming={0}
      isVisible={isVisible}
      backdropOpacity={0.3}
      avoidKeyboard={avoidKeyboard}
      // animationIn={'fadeInUp'}
      // animationOut={'fadeOutDown'}
      style={{
        flexDirection: 'column',
        padding: 10,
        justifyContent: alignCard,
      }}
      onBackdropPress={() => {
        if (onBackdropPress) {
          onBackdropPress();
        }
      }}>
      <View
        style={{
          flexDirection: shouldStretchWidth ? 'column' : 'row',
          justifyContent: 'center',
        }}>
        <BasicCard {...restProps}>{children}</BasicCard>
      </View>
    </Modal>
  );
};
