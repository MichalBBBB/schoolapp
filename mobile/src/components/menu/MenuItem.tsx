import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {BasicButton} from '../basicViews/BasicButton';
import {BasicText, BasicTextProps} from '../basicViews/BasicText';

interface MenuItemProps extends BasicTextProps {
  text: string;
  onPress: () => void;
  closeModal?: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  text,
  onPress,
  closeModal,
  ...props
}) => {
  const styles = StyleSheet.create({
    body: {
      padding: 5,
      alignItems: 'flex-start',
    },
  });

  const handleOnPress = () => {
    if (closeModal) {
      closeModal();
    }
    onPress();
  };

  return (
    <>
      <BasicButton
        variant="unstyled"
        onPress={handleOnPress}
        style={styles.body}>
        <BasicText numberOfLines={1} {...props}>
          {text}
        </BasicText>
      </BasicButton>
    </>
  );
};
