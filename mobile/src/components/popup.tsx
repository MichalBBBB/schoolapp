import {Portal} from '@gorhom/portal';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {ColorsObject} from '../types/Theme';
import useKeyboardHeight, {isIOS} from '../utils/keyboardHeight';

export interface PopupProps {
  trigger: React.ReactElement;
  forceSide?: 'right' | 'left';
  extraOnPress?: () => void;
  triggerContainerStyle?: ViewStyle;
}

const {width: layoutWidth, height: layoutHeight} = Dimensions.get('window');

export const Popup: React.FC<PopupProps> = ({
  trigger,
  children,
  forceSide,
  extraOnPress,
  triggerContainerStyle,
}) => {
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

  const [isTop, setIsTop] = useState(false);
  const [isRight, setisRight] = useState(true);

  const scale = useSharedValue(0);
  const top = useSharedValue(0);
  const left = useSharedValue(0);

  const closeModal = () => {
    setShouldClose(true);
  };

  const setModalToClosed = () => {
    // setContentVisible(false);
    setPopupVisible(false);
    setShouldClose(false);
  };

  useEffect(() => {
    if (shouldClose) {
      scale.value = withSpring(
        0,
        {damping: 10, mass: 0.5, stiffness: 150, overshootClamping: true},
        () => {
          runOnJS(setModalToClosed)();
        },
      );
    }
  }, [shouldClose]);

  // useEffect(() => {
  //   if (shouldAnimate && !contentVisible && popupVisible) {
  //     setContentVisible(true);
  //     scale.value = 0;
  //     scale.value = withSpring(1, {damping: 10, mass: 0.3, stiffness: 180});
  //     setShouldAnimate(false);
  //   }
  // }, [contentDimensions]);

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

  useEffect(() => {
    let tempLeft = 0;
    let tempTop = 0;

    // if the popup is outside the screen from the left
    if (
      triggerDimensions.left - contentDimensions.width < 0 &&
      forceSide !== 'right'
    ) {
      tempLeft = triggerDimensions.left;

      setisRight(false);
    } else {
      tempLeft =
        triggerDimensions.left -
        contentDimensions.width +
        triggerDimensions.width;
      setisRight(true);
    }

    if (isIOS) {
      const initialTriggerTop =
        triggerDimensions.top + triggerDimensions.height + 10;
      if (
        contentDimensions.height + initialTriggerTop >
        layoutHeight - keyboardHeight
      ) {
        tempTop = triggerDimensions.top - contentDimensions.height - 10;
        setIsTop(false);
      } else {
        tempTop = initialTriggerTop;
        setIsTop(true);
      }
    } else {
      const initialTriggerTop =
        triggerDimensions.top + triggerDimensions.height;
      // + NativeModules.StatusBarManager.HEIGHT;
      if (
        initialTriggerTop + contentDimensions.height >
        layoutHeight - keyboardHeight
      ) {
        tempTop =
          initialTriggerTop -
          triggerDimensions.height -
          contentDimensions.height;
        setIsTop(false);
      } else {
        tempTop = initialTriggerTop;
        setIsTop(true);
      }
    }
    top.value = tempTop;
    left.value = tempLeft;
  }, [contentDimensions, triggerDimensions]);

  useEffect(() => {
    if (shouldAnimate && popupVisible && contentDimensions.height !== 0) {
      scale.value = 0;
      scale.value = withSpring(1, {damping: 10, mass: 0.3, stiffness: 180});
      setShouldAnimate(false);
    }
  }, [top, left, popupVisible, contentDimensions]);

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      top: top.value,
      left: left.value,
      // hide the view until it's in its final position
      opacity: top.value !== 0 && left.value !== 0 ? 1 : 0,
      transform: [
        {
          translateY: interpolate(
            scale.value,
            [0, 1],
            [
              isTop
                ? -contentDimensions.height / 2
                : contentDimensions.height / 2,
              0,
            ],
          ),
        },
        {
          translateX: interpolate(
            scale.value,
            [0, 1],
            [
              isRight
                ? contentDimensions.width / 2
                : -contentDimensions.width / 2,
              0,
            ],
          ),
        },
        {
          scale: scale.value,
        },
      ],
    };
  });

  const content = Array.isArray(children)
    ? children.map((childrenItem, index) => {
        if (childrenItem) {
          return React.cloneElement(childrenItem, {
            closeModal: setModalToClosed,
            animateClose: closeModal,
            key: index,
          });
        }
      })
    : React.cloneElement(children as any, {
        closeModal: setModalToClosed,
        animateClose: closeModal,
      });

  return (
    <>
      <View
        ref={triggerWrapperRef}
        style={triggerContainerStyle}
        collapsable={false}>
        {React.cloneElement(trigger, {
          onPress: () => {
            // setContentVisible(false);
            measureTrigger();
            setPopupVisible(true);
            extraOnPress?.();
          },
        })}
      </View>
      <Portal>
        {popupVisible && (
          <View style={styles.modalWrapper}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={closeModal}
              style={[styles.modalWrapper]}>
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                style={[
                  styles.modalWrapper,
                  {backgroundColor: 'rgba(0,0,0,0.3)'},
                ]}
              />
            </TouchableOpacity>
            <View
              style={{position: 'absolute', top: 0, left: 0, opacity: 0}}
              onLayout={event => {
                setContentDimensions({
                  height: event.nativeEvent.layout.height,
                  width: event.nativeEvent.layout.width,
                });
                setShouldAnimate(true);
              }}>
              {content}
            </View>
            <Animated.View
              style={[
                {
                  alignSelf: 'flex-start',
                  zIndex: 99,
                  // top,
                  // left,
                },
                contentAnimatedStyle,
              ]}>
              {content}
            </Animated.View>
          </View>
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
