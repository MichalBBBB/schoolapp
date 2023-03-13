import {Portal} from '@gorhom/portal';
import React from 'react';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  runOnJS,
} from 'react-native-reanimated';

interface ModalProps {
  isVisible: boolean;
  onBackdropPress?: () => void;
  style?: ViewStyle;
  avoidKeyboard?: boolean;
  backdropOpacity?: number;
}
export const Modal: React.FC<ModalProps> = ({
  isVisible,
  onBackdropPress,
  style,
  children,
  avoidKeyboard = false,
  backdropOpacity = 0,
}) => {
  const content = (
    <Animated.View entering={FadeInDown} exiting={FadeOutDown}>
      {children}
    </Animated.View>
  );

  return (
    <Portal>
      {isVisible && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={onBackdropPress}
          style={[styles.modalWrapper]}>
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={[
              {
                flex: 1,
                width: '100%',
                backgroundColor: `rgba(0,0,0,${backdropOpacity})`,
              },
              style,
            ]}>
            {avoidKeyboard ? (
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                {content}
              </KeyboardAvoidingView>
            ) : (
              content
            )}
          </Animated.View>
        </TouchableOpacity>
      )}
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalWrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
});
