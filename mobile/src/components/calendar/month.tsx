import dayjs from 'dayjs';
import React, {memo} from 'react';
import {Text, View} from 'react-native';
import Week from './week';

// ctreate table of days in 6 weeks
export const createMatrix = (year: number, month: number) => {
  const matrix: dayjs.Dayjs[][] = [];
  const date = dayjs(new Date(year, month, 1));

  // get the day of the week of the first day of the month (0 - 6)
  const firstDay = date.startOf('month').weekday();

  // get the first day of the first week
  let day = date.subtract(firstDay, 'day');

  for (var row = 0; row < 6; row++) {
    matrix.push([]);
    for (var col = 0; col < 7; col++) {
      //add day to current row
      matrix[row].push(day);

      //add 1 day to the date
      day = day.add(1, 'day');
    }
  }
  return matrix;
};

interface MonthProps {
  month: dayjs.Dayjs | string;
  selectedDay: dayjs.Dayjs | null;
  onDayPress: (date: dayjs.Dayjs) => void;
  calendarWidth: number;
  weekHeight: number;
}

const Month: React.FC<MonthProps> = ({
  month,
  selectedDay,
  onDayPress,
  calendarWidth,
  weekHeight,
}) => {
  // if month is far away from being visible, only a simple view will appear with the string date
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
      {createMatrix(month.get('year'), month.get('month')).map(
        (week, index) => (
          <Week
            calendarWidth={calendarWidth}
            weekHeight={weekHeight}
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

export default memo(Month);
