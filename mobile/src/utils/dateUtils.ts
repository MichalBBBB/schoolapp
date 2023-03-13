import dayjs from 'dayjs';

export const getWeekday = (date: dayjs.Dayjs, startOfWeek: string) => {
  const weekday = date.locale('en').weekday();

  let actualWeekDay;

  if (startOfWeek == 'MON') {
    actualWeekDay = weekday - 1;
    if (actualWeekDay < 0) {
      actualWeekDay = 6;
    }
  } else if (startOfWeek == 'SAT') {
    actualWeekDay = weekday + 1;
    if (actualWeekDay > 6) {
      actualWeekDay = 0;
    }
  } else {
    actualWeekDay = weekday;
  }
  return actualWeekDay;
};

export const getStartOfWeek = (date: dayjs.Dayjs, startOfWeek: string) => {
  var day = date.locale('sk').startOf('week');
  if (startOfWeek == 'SUN') {
    if (date.locale('sk').weekday() == 6) {
      day = date;
    } else {
      day = day.subtract(1, 'day');
    }
  } else if (startOfWeek == 'SAT') {
    if (date.locale('sk').weekday() == 6) {
      day = date.subtract(1, 'day');
    } else if (date.locale('sk').weekday() == 5) {
      day = date;
    } else {
      day = day.subtract(2, 'day');
    }
  }
  console.log(date, day, date.locale('sk').weekday());
  return day;
};
