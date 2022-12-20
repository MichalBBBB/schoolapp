import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';

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
      <Pressable onPress={handleOnPress} style={styles.body}>
        <Text numberOfLines={1}>{text}</Text>
      </Pressable>
    </>
  );
};
