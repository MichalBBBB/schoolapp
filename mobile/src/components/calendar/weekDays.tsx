import React from 'react';
import {View, Text} from 'react-native';
import {useSettings} from '../../utils/useSettings';
import {BasicText} from '../basicViews/BasicText';

const weekDaysMon = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const weekDaysSun = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const weekDaysSat = ['S', 'S', 'M', 'T', 'W', 'T', 'F'];

interface weekDaysProps {
  weekHeaderHeight: number;
  width: number;
}

const WeekDays: React.FC<weekDaysProps> = ({weekHeaderHeight, width}) => {
  const settings = useSettings();
  const getWeekdays = () => {
    if (settings?.startOfWeek == 'SUN') {
      return weekDaysSun;
    } else if (settings?.startOfWeek == 'SAT') {
      return weekDaysSat;
    } else {
      return weekDaysMon;
    }
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        zIndex: 10,
        width: width,
      }}>
      {getWeekdays().map((item, index) => (
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
