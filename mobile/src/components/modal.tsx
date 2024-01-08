import {Portal} from '@gorhom/portal';
import React from 'react';
import {useEffect} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
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
    <Animated.View
      style={{zIndex: 99}}
      entering={FadeInDown.springify().stiffness(180).mass(0.3)}
      exiting={FadeOutDown.springify().stiffness(150).mass(0.7)}>
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
    if (avoidKeyboard && Platform.OS == 'ios') {
      if (isVisible) {
        KeyboardManager.setEnable(false);
      } else {
        KeyboardManager.setEnable(true);
      }
    }
  }, [isVisible]);

  return (
    <Portal>
      {isVisible && (
        <View style={styles.modalWrapper}>
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
            <TouchableOpacity
              activeOpacity={1}
              onPress={onBackdropPress}
              style={[
                styles.modalWrapper,
                {backgroundColor: `rgba(0,0,0,${backdropOpacity})`},
              ]}
            />
            {avoidKeyboard ? (
              <KeyboardAvoidingView
                style={{zIndex: 99}}
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
