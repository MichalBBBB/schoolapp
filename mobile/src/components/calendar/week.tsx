import dayjs from 'dayjs';
import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BasicText} from '../basicViews/BasicText';
import Day from './day';

interface WeekProps {
  week: dayjs.Dayjs[] | string;
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
          key={index}
          isSelected={day.isSame(selectedDay, 'date')}
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
    if (!nextProps.week[0].isSame(prevProps.week[0], 'day')) return false;
  }

  if (
    typeof nextProps.week !== 'string' &&
    typeof prevProps.week !== 'string' &&
    ((nextProps.selectedDay?.isBefore(nextProps.week[6].add(1, 'day')) &&
      nextProps.selectedDay.isAfter(nextProps.week[0].subtract(1, 'day'))) ||
      (prevProps.selectedDay?.isBefore(nextProps.week[6].add(1, 'day')) &&
        prevProps.selectedDay.isAfter(nextProps.week[0].subtract(1, 'day'))))
  ) {
    // month does not change, but new date is selected. Only re-render the
    // month where the newly selected date is in it.
    return false;
  }
  return true;
});
