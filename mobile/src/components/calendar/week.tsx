import dayjs from 'dayjs';
import React from 'react';
import {Text, View} from 'react-native';
import {calendarWidth, weekHeight} from '.';
import Day from './day';

interface WeekProps {
  week: dayjs.Dayjs[] | string;
  monthNum?: number | undefined;
  selectedDay: dayjs.Dayjs;
  onDayPress: (date: dayjs.Dayjs) => void;
}

const Week: React.FC<WeekProps> = ({
  week,
  monthNum,
  selectedDay,
  onDayPress,
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

export default Week;
