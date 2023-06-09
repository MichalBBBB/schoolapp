import dayjs from 'dayjs';
import {
  CalendarEvent,
  CalendarEventFragment,
  Lesson,
  LessonFragment,
  ProjectTaskWithProjectFragment,
  TaskFragment,
} from '../generated/graphql';

export const getStart = (
  item:
    | LessonFragment
    | CalendarEventFragment
    | TaskFragment
    | ProjectTaskWithProjectFragment,
  date: dayjs.Dayjs,
) => {
  if (item.__typename == 'Lesson') {
    const [hours, minutes] = item.lessonTime.startTime.split(':');
    return date.hour(parseInt(hours)).minute(parseInt(minutes));
  } else if (item.__typename == 'CalendarEvent') {
    return dayjs(item.startDate);
  } else if (item.__typename == 'Task') {
    return item.doDate ? dayjs(item.doDate) : date;
  } else if (item.__typename == 'ProjectTask') {
    return item.doDate ? dayjs(item.doDate) : date;
  } else {
    return date;
  }
};

export const getRealEnd = (
  item:
    | LessonFragment
    | CalendarEventFragment
    | TaskFragment
    | ProjectTaskWithProjectFragment,
  date: dayjs.Dayjs,
) => {
  if (item.__typename == 'Lesson') {
    const [hours, minutes] = item.lessonTime.endTime.split(':');
    return date.hour(parseInt(hours)).minute(parseInt(minutes));
  } else if (item.__typename == 'CalendarEvent') {
    return dayjs(item.endDate);
  } else if (item.__typename == 'Task') {
    if (item.doDate && item.duration && item.doDateIncludesTime) {
      return dayjs(item.doDate).add(item.duration, 'm');
    } else {
      return date;
    }
  } else if (item.__typename == 'ProjectTask') {
    if (item.doDate && item.duration && item.doDateIncludesTime) {
      return dayjs(item.doDate).add(item.duration, 'm');
    } else {
      return date;
    }
  } else {
    return date;
  }
};

export const getEnd = (
  item:
    | LessonFragment
    | CalendarEventFragment
    | TaskFragment
    | ProjectTaskWithProjectFragment,
  date: dayjs.Dayjs,
) => {
  if (item.__typename == 'Lesson') {
    const [startHours, startMinutes] = item.lessonTime.startTime.split(':');
    const startDate = date
      .hour(parseInt(startHours))
      .minute(parseInt(startMinutes));
    const [hours, minutes] = item.lessonTime.endTime.split(':');

    const endDate = date.hour(parseInt(hours)).minute(parseInt(minutes));
    if (endDate.diff(startDate, 'm') < 10) {
      return startDate.add(10, 'm');
    } else {
      return endDate;
    }
  } else if (item.__typename == 'CalendarEvent') {
    if (dayjs(item.endDate).diff(item.startDate, 'm') < 10) {
      return dayjs(item.startDate).add(10, 'm');
    } else {
      return dayjs(item.endDate);
    }
  } else if (item.__typename == 'Task') {
    if (item.doDate && item.duration && item.doDateIncludesTime) {
      if (item.duration < 10) {
        return dayjs(item.doDate).add(10, 'm');
      } else {
        return dayjs(item.doDate).add(item.duration, 'm');
      }
    } else {
      return date;
    }
  } else if (item.__typename == 'ProjectTask') {
    if (item.doDate && item.duration && item.doDateIncludesTime) {
      if (item.duration < 10) {
        return dayjs(item.doDate).add(10, 'm');
      } else {
        return dayjs(item.doDate).add(item.duration, 'm');
      }
    } else {
      return date;
    }
  } else {
    return date;
  }
};

export const isOverlap = (
  date: dayjs.Dayjs,
  first:
    | CalendarEventFragment
    | LessonFragment
    | TaskFragment
    | ProjectTaskWithProjectFragment,
  second:
    | CalendarEventFragment
    | LessonFragment
    | TaskFragment
    | ProjectTaskWithProjectFragment,
) => {
  return (
    (getStart(first, date).isAfter(getStart(second, date)) &&
      getStart(first, date).isBefore(getEnd(second, date))) ||
    (getEnd(first, date).isAfter(getStart(second, date)) &&
      getEnd(first, date).isBefore(getEnd(second, date))) ||
    (getStart(second, date).isAfter(getStart(first, date)) &&
      getStart(second, date).isBefore(getEnd(first, date))) ||
    (getEnd(second, date).isAfter(getStart(first, date)) &&
      getEnd(second, date).isBefore(getEnd(first, date)))
  );
};
