import dayjs from 'dayjs';
import React from 'react';
import {View} from 'react-native';
import Day from './day';

interface WeekProps {
  week: dayjs.Dayjs[];
  monthNum: number;
  selectedDay: dayjs.Dayjs;
  onDayPress: (date: dayjs.Dayjs) => void;
}

const Week: React.FC<WeekProps> = ({
  week,
  monthNum,
  selectedDay,
  onDayPress,
}) => {
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
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
