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
  BackHandler,
  View,
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
  alignContent?: 'flex-end' | 'center' | 'flex-start' | undefined;
}
export const Modal: React.FC<ModalProps> = ({
  isVisible,
  onBackdropPress,
  style,
  children,
  avoidKeyboard = false,
  backdropOpacity = 0,
  alignContent = 'center',
}) => {
  const content = (
    <Animated.View entering={FadeInDown} exiting={FadeOutDown}>
      {children}
    </Animated.View>
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (isVisible) {
          onBackdropPress?.();
          return true;
        } else {
          return false;
        }
      },
    );
    return () => backHandler.remove();
  });

  return (
    <Portal>
      {isVisible && (
        <View style={styles.modalWrapper}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={onBackdropPress}
            style={[
              styles.modalWrapper,
              {backgroundColor: `rgba(0,0,0,${backdropOpacity})`},
            ]}
          />
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            pointerEvents="box-none"
            style={[
              {
                flex: 1,
                width: '100%',
                zIndex: 99,
                justifyContent: alignContent,
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
        </View>
      )}
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalWrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    flex: 1,
  },
});
