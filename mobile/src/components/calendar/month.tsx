import dayjs from 'dayjs';
import React, {memo, useMemo} from 'react';
import {Text, View} from 'react-native';
import {useSettings} from '../../utils/useSettings';
import {BasicText} from '../basicViews/BasicText';
import Week from './week';

// ctreate table of days in 6 weeks
export const createMatrix = (
  year: number,
  month: number,
  startOfWeek: string,
) => {
  const matrix: dayjs.Dayjs[][] = [];
  const date = dayjs(new Date(year, month, 1));

  // get the day of the week of the first day of the month (0 - 6)
  // when locale is set to en - the first day is sunday
  const firstDay = date.startOf('month').locale('en').weekday();

  let actualFirstDay;

  if (startOfWeek == 'MON') {
    actualFirstDay = firstDay - 1;
    if (actualFirstDay < 0) {
      actualFirstDay = 6;
    }
  } else if (startOfWeek == 'SAT') {
    actualFirstDay = firstDay + 1;
    if (actualFirstDay > 6) {
      actualFirstDay = 0;
    }
  } else {
    actualFirstDay = firstDay;
  }

  // get the first day of the first week
  let day = date.subtract(actualFirstDay, 'day');

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
  startOfWeek: string;
}

const Month: React.FC<MonthProps> = ({
  month,
  selectedDay,
  onDayPress,
  calendarWidth,
  weekHeight,
  startOfWeek,
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
        <BasicText>{month}</BasicText>
      </View>
    );
  }

  const matrix = useMemo(() => {
    return createMatrix(month.get('year'), month.get('month'), startOfWeek);
  }, [month, startOfWeek]);

  return (
    <View style={{width: calendarWidth}}>
      {matrix.map((week, index) => (
        <Week
          calendarWidth={calendarWidth}
          weekHeight={weekHeight}
          week={week}
          monthNum={month.get('month') + 1}
          key={index}
          selectedDay={selectedDay}
          onDayPress={onDayPress}
        />
      ))}
    </View>
  );
};

export default memo(Month, (prevProps, nextProps) => {
  if (prevProps.month !== nextProps.month) {
    // render new month due to month change
    return false;
  }

  if (prevProps.startOfWeek != nextProps.startOfWeek) {
    return false;
  }
  // if the new or old selected day is in this month, rerender
  if (
    typeof nextProps.month !== 'string' &&
    (nextProps.selectedDay?.get('month') === nextProps.month.get('month') ||
      prevProps.selectedDay?.get('month') === nextProps.month.get('month'))
  ) {
    return false;
  }
  return true;
});
