import React from 'react';
import {View, Text} from 'react-native';

const weekDays = ['m', 't', 'w', 't', 'f', 's', 's'];

interface weekDaysProps {
  weekHeaderHeight: number;
  width: number;
}

const WeekDays: React.FC<weekDaysProps> = ({weekHeaderHeight, width}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        zIndex: 10,
        width: width,
      }}>
      {weekDays.map((item, index) => (
        <View
          style={{
            height: weekHeaderHeight,
            width: 30,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          key={index}>
          <Text style={{color: 'grey'}}>{item}</Text>
        </View>
      ))}
    </View>
  );
};

export default WeekDays;
