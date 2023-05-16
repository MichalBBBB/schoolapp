import dayjs from 'dayjs';
import React, {memo, useMemo} from 'react';
import {Text, View} from 'react-native';
import {DayWithDot} from '.';
import {
  CalendarEventFragment,
  TaskFragment,
  useGetAllEventsQuery,
  useGetAllTasksQuery,
} from '../../generated/graphql';
import {useSettings} from '../../utils/hooks/useSettings';
import {BasicText} from '../basicViews/BasicText';
import Week from './week';

// ctreate table of days in 6 weeks
export const createMatrix = (
  year: number,
  month: number,
  daysWithDots: dayjs.Dayjs[] = [],
) => {
  const matrix: DayWithDot[][] = [];
  const date = dayjs(new Date(year, month, 1));

  // get the day of the week of the first day of the month (0 - 6)
  const firstDay = date.startOf('month').weekday();

  // get the first day of the first week
  let day = date.subtract(firstDay, 'day');

  for (var row = 0; row < 6; row++) {
    matrix.push([]);
    for (var col = 0; col < 7; col++) {
      //add day to current row
      matrix[row].push({
        date: day,
        dot: daysWithDots.some(item => item.isSame(day, 'day')),
      });

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
  daysWithDots?: dayjs.Dayjs[];
}

const Month: React.FC<MonthProps> = ({
  month,
  selectedDay,
  onDayPress,
  calendarWidth,
  weekHeight,
  startOfWeek,
  daysWithDots,
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
    return createMatrix(month.get('year'), month.get('month'), daysWithDots);
  }, [month, startOfWeek, daysWithDots]);

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

  if (prevProps.startOfWeek !== nextProps.startOfWeek) {
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
