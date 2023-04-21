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
import KeyboardManager from 'react-native-keyboard-manager/dist';
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

  useEffect(() => {
    if (isVisible && avoidKeyboard) {
      KeyboardManager.setEnable(false);
    } else {
      KeyboardManager.setEnable(true);
    }
  }, [isVisible]);

  return (
    <Portal>
      {isVisible && (
        <View style={styles.modalWrapper}>
          <Animated.View
            entering={FadeIn.duration(100)}
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
            <TouchableOpacity
              activeOpacity={1}
              onPress={onBackdropPress}
              style={[
                styles.modalWrapper,
                {backgroundColor: `rgba(0,0,0,${backdropOpacity})`},
              ]}
            />
            <View style={{zIndex: 99}}>
              {avoidKeyboard ? (
                <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                  {content}
                </KeyboardAvoidingView>
              ) : (
                content
              )}
            </View>
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
