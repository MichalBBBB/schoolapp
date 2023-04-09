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
  style,
  ...restProps
}) => {
  const [theme] = useTheme();
  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.3}
      avoidKeyboard={avoidKeyboard}
      alignContent={alignCard}
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
        <BasicCard {...restProps} style={[{margin: 10}, style]}>
          {children}
        </BasicCard>
      </View>
    </Modal>
  );
};
