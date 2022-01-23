import React, {useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {
  Gesture,
  GestureDetector,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import SlidingView from './slidingView';

const Task: React.FC<{name: string}> = ({name}) => {
  const back = (
    <View
      style={{
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}>
      <Image
        source={require('../../assets/Delete.png')}
        style={{
          resizeMode: 'stretch',
          height: 25,
          width: 25,
        }}
      />
    </View>
  );

  return (
    <View>
      <SlidingView
        frontView={
          <View style={{padding: 10, backgroundColor: 'white'}}>
            <Text>{name}</Text>
          </View>
        }
        backView={[back]}
        backViewWidth={70}
        numberOfBackElements={1}
      />
    </View>
  );
};

export default Task;
