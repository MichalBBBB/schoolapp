import dayjs from 'dayjs';
import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BasicText} from '../basicViews/BasicText';
import Day from './day';

import {DayWithDot} from '.';

interface WeekProps {
  week: DayWithDot[] | string;
  monthNum?: number | undefined;
  selectedDay: dayjs.Dayjs | null;
  onDayPress: (date: dayjs.Dayjs) => void;
  calendarWidth: number;
  weekHeight: number;
}

const Week: React.FC<WeekProps> = ({
  week,
  monthNum,
  selectedDay,
  onDayPress,
  calendarWidth,
  weekHeight,
}) => {
  if (typeof week == 'string') {
    return (
      <View style={{width: calendarWidth, height: weekHeight}}>
        <BasicText>{week}</BasicText>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {week.map((day, index) => (
        <Day
          weekHeight={weekHeight}
          key={index}
          isSelected={day.date.isSame(selectedDay, 'date')}
          monthNum={monthNum}
          day={day}
          onPress={onDayPress}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});

export default memo(Week, (prevProps, nextProps) => {
  if (typeof nextProps.week == 'string' && typeof prevProps.week == 'string') {
    if (nextProps.week !== prevProps.week) return false;
  } else if (
    typeof nextProps.week !== 'string' &&
    typeof prevProps.week !== 'string'
  ) {
    // if (!nextProps.week[0].date.isSame(prevProps.week[0].date, 'day'))
    //   return false;
    // const one = JSON.stringify(prevProps.week);
    // const two = JSON.stringify(nextProps.week);
    // console.log(one, two, one == two);
    if (JSON.stringify(prevProps.week) !== JSON.stringify(nextProps.week)) {
      return false;
    }
  } else {
    return false;
  }

  if (
    typeof nextProps.week !== 'string' &&
    typeof prevProps.week !== 'string' &&
    (nextProps.selectedDay?.week() == nextProps.week[0].date.week() ||
      prevProps.selectedDay?.week() == nextProps.week[0].date.week())
  ) {
    return false;
  }

  return true;
});
