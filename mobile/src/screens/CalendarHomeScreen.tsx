import React, {useState} from 'react';
import {Text, View} from 'react-native';
import Calendar from '../components/calendar';

const CalendarHomeScreen = () => {
  const [screenHeight, setScreenHeight] = useState(0);
  const findDimensions = (layout: any) => {
    const {x, y, width, height} = layout;
    console.log('height', layout);
    setScreenHeight(height);
  };
  return (
    <View
      style={{flex: 1}}
      onLayout={event => findDimensions(event.nativeEvent.layout)}>
      <Calendar screenHeight={screenHeight} />
    </View>
  );
};

export default CalendarHomeScreen;
