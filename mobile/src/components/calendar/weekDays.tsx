import React from 'react';
import {View, Text} from 'react-native';
import {useSettings} from '../../utils/useSettings';
import {BasicText} from '../basicViews/BasicText';

const weekDaysMon = ['m', 't', 'w', 't', 'f', 's', 's'];

const weekDaysSun = ['s', 'm', 't', 'w', 't', 'f', 's'];

const weekDaysSat = ['s', 's', 'm', 't', 'w', 't', 'f'];

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
