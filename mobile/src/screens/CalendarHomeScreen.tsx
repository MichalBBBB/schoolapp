import React, {useState} from 'react';
import {Text, View} from 'react-native';
import AddButton from '../components/addButton';
import Calendar from '../components/calendar';
import CalendarView from '../components/calendarView/calendarView';

const CalendarHomeScreen = () => {
  const [screenHeight, setScreenHeight] = useState(0);
  const findDimensions = (layout: any) => {
    const {x, y, width, height} = layout;
    setScreenHeight(height);
  };
  return (
    <View
      style={{flex: 1}}
      onLayout={event => findDimensions(event.nativeEvent.layout)}>
      <CalendarView screenHeight={screenHeight} />
      <View style={{position: 'absolute', right: 0, bottom: 0, margin: 20}}>
        <AddButton onPress={() => {}} />
      </View>
    </View>
  );
};

export default CalendarHomeScreen;
