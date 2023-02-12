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

export default memo(Week);
