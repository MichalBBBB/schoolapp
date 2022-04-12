import dayjs from 'dayjs';
import React, {memo} from 'react';
import {Text, View} from 'react-native';
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
        <Text>{week}</Text>
      </View>
    );
  }
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
      }}>
      {week.map((day, index) => (
        <Day
          key={index}
          selectedDay={selectedDay}
          monthNum={monthNum}
          day={day}
          onPress={onDayPress}
        />
      ))}
    </View>
  );
};

export default memo(Week);
