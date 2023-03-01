import {Portal} from '@gorhom/portal';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Dimensions,
  NativeModules,
  Pressable,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import useKeyboardHeight, {isIOS} from '../utils/keyboardHeight';

interface PopupProps {
  trigger: React.ReactNode;
}

const {width: layoutWidth, height: layoutHeight} = Dimensions.get('window');

export const Popup: React.FC<PopupProps> = ({trigger, children}) => {
  const {keyboardHeight} = useKeyboardHeight();
  const triggerWrapperRef = useRef<View>(null);
  const [triggerDimensions, setTriggerDimensions] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const [contentDimensions, setContentDimensions] = useState({
    height: 0,
    width: 0,
  });
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [shouldClose, setShouldClose] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const scale = useSharedValue(1);

  const closeModal = () => {
    setShouldClose(true);
  };

  const setModalToClosed = () => {
    setPopupVisible(false);
    setContentVisible(false);
    setShouldClose(false);
  };

  useEffect(() => {
    if (shouldClose) {
      scale.value = withTiming(0, {duration: 300}, () => {
        runOnJS(setModalToClosed)();
      });
    }
  }, [shouldClose]);

  useEffect(() => {
    if (shouldAnimate) {
      setContentVisible(true);
      scale.value = 0;
      scale.value = withTiming(1, {duration: 300});
      setShouldAnimate(false);
    }
  }, [contentDimensions]);

  const measureTrigger = () => {
    triggerWrapperRef.current?.measureInWindow((x, y, width, height) => {
      setTriggerDimensions({
        top: Math.max(y, 0),
        left: x,
        width,
        height,
      });
    });
  };

  const {top, left} = useMemo(() => {
    let left = 0;
    let top = 0;

    left =
      triggerDimensions.left -
      contentDimensions.width +
      triggerDimensions.width;
    // if the popup is outside the screen from the left
    if (triggerDimensions.left - contentDimensions.width < 0)
      left = triggerDimensions.left;

    if (isIOS) {
      const initialTriggerTop =
        triggerDimensions.top + triggerDimensions.height + 10;
      if (
        contentDimensions.height + initialTriggerTop >
        layoutHeight - keyboardHeight
      )
        top = triggerDimensions.top - contentDimensions.height - 10;
      else top = initialTriggerTop;
    } else {
      const initialTriggerTop =
        triggerDimensions.top +
        triggerDimensions.height +
        NativeModules.StatusBarManager.HEIGHT;

      top =
        initialTriggerTop + contentDimensions.height >
        layoutHeight - keyboardHeight
          ? initialTriggerTop -
            triggerDimensions.height -
            contentDimensions.height
          : initialTriggerTop;
    }
    return {top, left};
  }, [contentDimensions, triggerDimensions]);

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scale.value,
            [0, 1],
            [-contentDimensions.height / 2, 0],
          ),
        },
        {
          translateX: interpolate(
            scale.value,
            [0, 1],
            [contentDimensions.width / 2, 0],
          ),
        },
        {
          scale: scale.value,
        },
      ],
    };
  });

  return (
    <>
      <Pressable
        onPress={() => {
          measureTrigger();
          setPopupVisible(true);
          setShouldAnimate(true);
        }}
        ref={triggerWrapperRef}>
        <View>{trigger}</View>
      </Pressable>
      <Portal hostName="popup">
        {popupVisible && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={closeModal}
            style={styles.modalWrapper}>
            <Animated.View
              onLayout={event => {
                setContentDimensions({
                  height: event.nativeEvent.layout.height,
                  width: event.nativeEvent.layout.width,
                });
                setShouldAnimate(true);
              }}
              style={[
                {
                  alignSelf: 'flex-start',
                  zIndex: 99,
                  opacity: contentVisible ? 1 : 0,
                  top,
                  left,
                },
                contentAnimatedStyle,
              ]}>
              {Array.isArray(children)
                ? children.map((childrenItem, index) => {
                    return React.cloneElement(childrenItem, {
                      closeModal: setModalToClosed,
                      key: index,
                    });
                  })
                : React.cloneElement(children as any, {
                    closeModal: setModalToClosed,
                  })}
            </Animated.View>
          </TouchableOpacity>
        )}
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  modalWrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
});
