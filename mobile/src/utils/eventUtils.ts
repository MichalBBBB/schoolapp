import dayjs from 'dayjs';
import {
  CalendarEvent,
  CalendarEventFragment,
  Lesson,
  LessonFragment,
} from '../generated/graphql';

export const getStart = (
  item: LessonFragment | CalendarEventFragment,
  date: dayjs.Dayjs,
) => {
  if (item.__typename == 'Lesson') {
    const [hours, minutes] = item.lessonTime.startTime.split(':');
    return date.hour(parseInt(hours)).minute(parseInt(minutes));
  } else if (item.__typename == 'CalendarEvent') {
    return dayjs(item.startDate);
  } else {
    return date;
  }
};
export const getEnd = (
  item: LessonFragment | CalendarEventFragment,
  date: dayjs.Dayjs,
) => {
  if (item.__typename == 'Lesson') {
    const [hours, minutes] = item.lessonTime.endTime.split(':');
    return date.hour(parseInt(hours)).minute(parseInt(minutes));
  } else if (item.__typename == 'CalendarEvent') {
    return dayjs(item.endDate);
  } else {
    return date;
  }
};

export const isOverlap = (
  date: dayjs.Dayjs,
  first: CalendarEventFragment | LessonFragment,
  second: CalendarEventFragment | LessonFragment,
) => {
  if (
    first.__typename == 'CalendarEvent' &&
    second.__typename == 'CalendarEvent'
  ) {
    return (
      (getStart(first, date).isAfter(second.startDate) &&
        getStart(first, date).isBefore(second.endDate)) ||
      (getEnd(first, date).isAfter(second.startDate) &&
        getEnd(first, date).isBefore(second.endDate)) ||
      (dayjs(second.startDate).isAfter(first.startDate) &&
        dayjs(second.startDate).isBefore(first.endDate)) ||
      (getEnd(second, date).isAfter(first.startDate) &&
        getEnd(second, date).isBefore(first.endDate))
    );
  } else if (
    first.__typename == 'Lesson' &&
    second.__typename == 'CalendarEvent'
  ) {
    return (
      (dayjs(second.startDate).isAfter(getStart(first, date)) &&
        dayjs(second.startDate).isBefore(getEnd(first, date))) ||
      (getEnd(second, date).isAfter(getStart(first, date)) &&
        getEnd(second, date).isBefore(getEnd(first, date))) ||
      (getStart(first, date).isAfter(second.startDate) &&
        getStart(first, date).isBefore(second.endDate)) ||
      (getEnd(first, date).isAfter(second.startDate) &&
        getEnd(first, date).isBefore(second.endDate))
    );
  } else if (
    first.__typename == 'CalendarEvent' &&
    second.__typename == 'Lesson'
  ) {
    return (
      (getStart(first, date).isAfter(getStart(second, date)) &&
        getStart(first, date).isBefore(getEnd(second, date))) ||
      (getEnd(first, date).isAfter(getStart(second, date)) &&
        getEnd(first, date).isBefore(getEnd(second, date))) ||
      (getStart(second, date).isAfter(first.startDate) &&
        getStart(second, date).isBefore(first.endDate)) ||
      (getEnd(second, date).isAfter(first.startDate) &&
        getEnd(second, date).isBefore(first.endDate))
    );
  } else {
    return false;
  }
};
