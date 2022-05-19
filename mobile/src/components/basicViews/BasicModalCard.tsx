import React, {useEffect} from 'react';
import {View} from 'react-native';
import Modal from 'react-native-modal';
import {useTheme} from '../../contexts/ThemeContext';
import {BasicCard} from './BasicCard';

interface BasicCardProps {
  backgroundColor?: string | undefined;
  borderRadius?: number | undefined;
  isVisible: boolean;
  avoidKeyboard?: boolean | undefined;
  onModalHide?: (() => void) | undefined;
  onBackdropPress?: (() => void) | undefined;
  alignCard: 'flex-end' | 'center' | 'flex-start' | undefined;
  padding?: number | undefined;
}

export const BasicModalCard: React.FC<BasicCardProps> = ({
  children,
  backgroundColor,
  borderRadius,
  isVisible,
  avoidKeyboard = false,
  onModalHide,
  onBackdropPress,
  alignCard = 'center',
  padding,
}) => {
  const [theme] = useTheme();
  return (
    <Modal
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
      <BasicCard
        backgroundColor={backgroundColor || theme.colors.background}
        borderRadius={borderRadius}
        padding={padding}>
        {children}
      </BasicCard>
    </Modal>
  );
};
