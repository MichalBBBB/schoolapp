import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {BasicButton} from '../basicViews/BasicButton';
import {BasicText} from '../basicViews/BasicText';

interface MenuItemProps {
  text: string;
  onPress: () => void;
  closeModal?: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  text,
  onPress,
  closeModal,
}) => {
  const styles = StyleSheet.create({
    body: {
      padding: 10,
      alignItems: 'flex-start',
    },
  });

  const handleOnPress = () => {
    onPress();
    if (closeModal) {
      closeModal();
    }
  };

  return (
    <>
      <BasicButton
        variant="unstyled"
        onPress={handleOnPress}
        style={styles.body}>
        <BasicText numberOfLines={1}>{text}</BasicText>
      </BasicButton>
    </>
  );
};
