import React, {ReactNode, useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface DropDownViewProps {
  renderTitleView: () => ReactNode;
  isOpen: Boolean;
}

const DropDownView: React.FC<DropDownViewProps> = ({
  renderTitleView,
  children,
  isOpen,
}) => {
  const [contentHeight, setContentHeight] = useState(0);
  const height = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  const findDimensions = (layout: any) => {
    const {height} = layout;
    console.log(height);
    setContentHeight(height);
  };

  useEffect(() => {
    console.log('here');
    if (isOpen) {
      height.value = withTiming(contentHeight);
    } else {
      height.value = withTiming(0);
    }
  }, [isOpen, children]);

  return (
    <View style={[styles.container]}>
      {renderTitleView && renderTitleView()}
      <Animated.View style={animatedStyle}>
        <View
          style={styles.content}
          onLayout={event => findDimensions(event.nativeEvent.layout)}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  content: {
    position: 'absolute',
    width: '100%',
  },
});

export default DropDownView;
