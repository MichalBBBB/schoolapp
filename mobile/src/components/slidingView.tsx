import React, {useState} from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface SlidingViewProps {
  frontView: JSX.Element;
  backView: JSX.Element[];
  backViewWidth: number;
  numberOfBackElements: number;
}

const SlidingView: React.FC<SlidingViewProps> = ({
  frontView,
  backView,
  backViewWidth,
  numberOfBackElements: number,
}) => {
  const x = useSharedValue(0);
  const [height, setHeight] = useState(0);
  const isPulled = useSharedValue(false);
  const pulledOffset = backViewWidth;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: x.value}],
    };
  });

  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: -x.value / number,
    };
  });

  const panGesture = Gesture.Pan()
    .onStart(_e => {})
    .onUpdate(e => {
      if (isPulled.value && e.translationX <= pulledOffset) {
        x.value = e.translationX - pulledOffset;
      } else {
        if (e.translationX < 0) {
          x.value = e.translationX;
        }
      }
    })
    .onEnd(e => {
      if (e.translationX < -pulledOffset && !isPulled.value) {
        isPulled.value = true;
      }
      if (e.translationX > 0 && isPulled.value) {
        isPulled.value = false;
      }
      x.value = withTiming(isPulled.value ? -pulledOffset : 0);
    });

  const findDimensions = (layout: any) => {
    const {x, y, width, height} = layout;
    setHeight(height);
  };

  const back = (
    <View
      style={{
        position: 'absolute',
        height: height,
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: '100%',
      }}>
      {backView.map((item, index) => (
        <Animated.View style={[backgroundAnimatedStyle]} key={index}>
          {item}
        </Animated.View>
      ))}
    </View>
  );

  return (
    <View>
      {back}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={animatedStyle}>
          <View onLayout={event => findDimensions(event.nativeEvent.layout)}>
            {frontView}
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default SlidingView;
