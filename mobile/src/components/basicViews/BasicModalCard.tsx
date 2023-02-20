import React, {useEffect} from 'react';
import {View} from 'react-native';
import Modal from 'react-native-modal';
import {useTheme} from '../../contexts/ThemeContext';
import {ColorsObject} from '../../types/Theme';
import {BasicCard, BasicCardProps} from './BasicCard';

export interface BasicModalCardProps extends BasicCardProps {
  borderRadius?: number | undefined;
  isVisible: boolean;
  avoidKeyboard?: boolean | undefined;
  onModalHide?: (() => void) | undefined;
  onBackdropPress?: (() => void) | undefined;
  alignCard: 'flex-end' | 'center' | 'flex-start' | undefined;
}

export const BasicModalCard: React.FC<BasicModalCardProps> = ({
  children,
  isVisible,
  avoidKeyboard = false,
  onModalHide,
  onBackdropPress,
  alignCard = 'center',
  ...restProps
}) => {
  const [theme] = useTheme();
  return (
    <Modal
      backdropTransitionOutTiming={0}
      isVisible={isVisible}
      backdropOpacity={0.3}
      avoidKeyboard={avoidKeyboard}
      animationIn={'fadeInUp'}
      animationOut={'fadeOutDown'}
      style={{margin: 10, justifyContent: alignCard}}
      onBackdropPress={() => {
        if (onBackdropPress) {
          onBackdropPress();
        }
      }}
      onModalHide={() => {
        if (onModalHide) {
          onModalHide();
        }
      }}>
      <BasicCard {...restProps}>{children}</BasicCard>
    </Modal>
  );
};
