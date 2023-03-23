import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {Text, View} from 'react-native';
import AddButton from '../../components/addButton';
import CalendarView from '../../components/calendarView/calendarView';
import {CalendarStackScreenProps} from '../../utils/types';

const CalendarHomeScreen: React.FC<
  CalendarStackScreenProps<'CalendarHomeScreen'>
> = ({navigation}) => {
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
        <AddButton
          onPress={() => {
            navigation.navigate('AddEventScreen');
          }}
        />
      </View>
    </View>
  );
};

export default CalendarHomeScreen;
