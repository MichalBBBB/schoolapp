import dayjs from 'dayjs';
import React from 'react';
import {Text, View} from 'react-native';
import {calendarWidth, createMatrix} from '.';
import Week from './week';

interface MonthProps {
  month: dayjs.Dayjs | string;
  selectedDay: dayjs.Dayjs;
  onDayPress: (date: dayjs.Dayjs) => void;
}

const Month: React.FC<MonthProps> = ({month, selectedDay, onDayPress}) => {
  if (typeof month == 'string') {
    return (
      <View
        style={{
          width: calendarWidth,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>{month}</Text>
      </View>
    );
  }

  return (
    <View style={{width: calendarWidth}}>
      {createMatrix(month.get('year'), month.get('month') + 1).map(
        (week, index) => (
          <Week
            week={week}
            monthNum={month.get('month') + 1}
            key={index}
            selectedDay={selectedDay}
            onDayPress={onDayPress}
          />
        ),
      )}
    </View>
  );
};

export default Month;
