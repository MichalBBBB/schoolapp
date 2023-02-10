import React from 'react';
import {View, Text} from 'react-native';
import {BasicText} from '../basicViews/BasicText';

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
          <BasicText color="textSecondary">{item}</BasicText>
        </View>
      ))}
    </View>
  );
};

export default WeekDays;
