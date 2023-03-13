import dayjs from 'dayjs';
import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BasicText} from '../basicViews/BasicText';
import Day from './day';
import weekOfYear from 'dayjs/plugin/weekOfYear';

interface WeekProps {
  week: dayjs.Dayjs[] | string;
  monthNum?: number | undefined;
  selectedDay: dayjs.Dayjs | null;
  onDayPress: (date: dayjs.Dayjs) => void;
  calendarWidth: number;
  weekHeight: number;
}

dayjs.extend(weekOfYear);

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
  if (prevProps.week !== nextProps.week) {
    return false;
  }
  if (typeof nextProps.week == 'string' && typeof prevProps.week == 'string') {
    if (nextProps.week !== prevProps.week) return false;
  } else if (
    typeof nextProps.week !== 'string' &&
    typeof prevProps.week !== 'string'
  ) {
    if (!nextProps.week[0].isSame(prevProps.week[0], 'day')) return false;
  }

  // if the new or old selected day is in this week, rerender
  // if (typeof nextProps.week !== 'string') {
  //   console.log(nextProps.week[0].week(), prevProps.selectedDay?.week());
  // }

  if (
    typeof nextProps.week !== 'string' &&
    typeof prevProps.week !== 'string' &&
    (nextProps.selectedDay?.week() == nextProps.week[0].week() ||
      prevProps.selectedDay?.week() == nextProps.week[0].week())
  ) {
    return false;
  }
  return true;
});
