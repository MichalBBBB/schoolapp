import React, {useEffect, useMemo} from 'react';
import dayjs from 'dayjs';
import Week from './week';

interface WeekViewItemProps {
  week: dayjs.Dayjs | string;
  monthNum?: number | undefined;
  selectedDay: dayjs.Dayjs | null;
  onDayPress: (date: dayjs.Dayjs) => void;
  calendarWidth: number;
  weekHeight: number;
  daysWithDots: dayjs.Dayjs[];
}

const createWeek = (
  date: dayjs.Dayjs | string,
  daysWithDots: dayjs.Dayjs[] = [],
) => {
  if (typeof date == 'string') {
    return date;
  }
  const filteredDaysWithDots = daysWithDots.filter(item =>
    item.isSame(date, 'week'),
  );
  let day = date.startOf('week');
  let week = [];
  for (var i = 0; i < 7; i++) {
    week.push({
      date: day,
      dot: filteredDaysWithDots.some(item => item.isSame(day, 'day')),
    });
    day = day.add(1, 'day');
  }
  return week;
};

export const WeekViewItem: React.FC<WeekViewItemProps> = ({
  week,
  daysWithDots,
  ...props
}) => {
  const weekArray = useMemo(() => {
    return createWeek(week, daysWithDots);
  }, [week, daysWithDots]);
  return <Week week={weekArray} {...props} />;
};
