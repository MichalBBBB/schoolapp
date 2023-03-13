import dayjs from 'dayjs';
import {
  LessonFragment,
  SettingsFragment,
  SubjectFragment,
} from '../generated/graphql';

// timetables have a lot of rotation options
// you can set the length of the rotation - after how many days will the classes repeat
// you can set whether it skips wekeends
// you can set when the rotation starts - allowing you to shift the rotation
//
// every day in the rotation has a number between 0 and length of rotation - 1
// every lesson has a time and a dayNumber

export const closestLesson = (
  lessons: LessonFragment[],
  subject: SubjectFragment,
  settings: SettingsFragment,
) => {
  const subjectLessons = lessons.filter(item => item.subject.id == subject.id);
  if (subjectLessons.length == 0) {
    return null;
  }
  subjectLessons.sort((a, b) => {
    return dayjs(getDateOfClosestInstanceOfLesson(a, settings)).diff(
      getDateOfClosestInstanceOfLesson(b, settings),
      'minute',
    );
  });
  console.log(subjectLessons);
  return getDateOfClosestInstanceOfLesson(subjectLessons[0], settings);
};

const getDateOfClosestInstanceOfLesson = (
  lesson: LessonFragment,
  settings: SettingsFragment,
) => {
  const dayNumber = getDayNumber(dayjs(), settings);
  if (
    lesson.dayNumber > dayNumber ||
    (lesson.dayNumber == dayNumber &&
      dayjs().isAfter(lesson.lessonTime.startTime))
  ) {
    if (settings.skipWeekends) {
      const date = addWorkDays(
        dayjs(lesson.lessonTime.startTime, 'HH:mm'),
        lesson.dayNumber - dayNumber,
      ).toDate();
      console.log(date);
      return date;
    } else {
      return dayjs(lesson.lessonTime.startTime, 'HH:mm').add(
        lesson.dayNumber - dayNumber,
        'day',
      );
    }
  } else if (
    lesson.dayNumber == dayNumber &&
    dayjs().isBefore(lesson.lessonTime.startTime)
  ) {
    return dayjs(lesson.lessonTime.startTime, 'HH:mm');
  } else {
    if (settings.skipWeekends) {
      return addWorkDays(
        dayjs(lesson.lessonTime.startTime, 'HH:mm'),
        settings.lengthOfRotation - dayNumber + lesson.dayNumber,
      ).toDate();
    } else {
      return dayjs(lesson.lessonTime.startTime, 'HH:mm')
        .add(settings.lengthOfRotation - dayNumber + lesson.dayNumber, 'day')
        .toDate();
    }
  }
};

export const getCurrentLesson = (
  lessons: LessonFragment[],
  settings: SettingsFragment,
) => {
  const dayNumber = getDayNumber(dayjs(), settings);
  const currentLesson = lessons.find(item => {
    return (
      dayNumber == item.dayNumber &&
      dayjs().isBefore(dayjs(item.lessonTime.endTime, 'HH:mm')) &&
      dayjs().isAfter(dayjs(item.lessonTime.startTime, 'HH:mm'))
    );
  });
  return currentLesson;
};

export const addWorkDays = (date: dayjs.Dayjs, workdays: number) => {
  const weekday = date.locale('sk').weekday();
  const daysUntilWekeend = 4 - weekday;
  if (workdays <= daysUntilWekeend) {
    return date.add(workdays, 'day');
  } else if (daysUntilWekeend >= 0) {
    const extraDays = workdays - daysUntilWekeend;
    const weekendDays = 2 + Math.floor(extraDays / 5) * 2;
    return date.add(workdays + weekendDays, 'day');
  } else {
    const weekendDays = 2 + daysUntilWekeend + Math.floor(workdays / 5) * 2;
    console.log(weekendDays, workdays);
    return date.add(workdays + weekendDays, 'day');
  }
};

// get dayNumber of a specific date
export const getDayNumber = (date: dayjs.Dayjs, settings: SettingsFragment) => {
  if (settings?.skipWeekends) {
    // if the date is on the weekend, just return -1 - meaning no dayNumber of the schedule
    if (date.locale('sk').weekday() == 6 || date.locale('sk').weekday() == 5) {
      return -1;
    }
    if (date.isAfter(settings.startOfRotationDate)) {
      // getting the number of days between the date and the start of the rotation
      // we have to set the hours of the date to be more than the hours of the startDate
      // otherwise it gives the incorrect value - it hasn't been the full 24 hours
      const daysBetween = date
        .set('hour', 7)
        .diff(dayjs(settings.startOfRotationDate).set('hour', 5), 'days');
      const numberOfFullWeeks = Math.floor(daysBetween / 7);
      // get the number of extra days that are not included in the full weeks
      const extraDays = daysBetween - numberOfFullWeeks * 7;
      // if the extra days include a weekend - add it to the weekend days
      const extraWeekendDays =
        dayjs(settings.startOfRotationDate).locale('sk').weekday() + extraDays >
        6
          ? 2
          : 0;
      // subtract the weekend days from the day difference and get the dayNumber
      const dayNumber =
        (daysBetween - numberOfFullWeeks * 2 - extraWeekendDays) %
        settings.lengthOfRotation;
      console.log(dayNumber);
      return dayNumber;
      // if the date is the same as the start of rotation, we know the dayNumber is 0
    } else if (date.isSame(settings.startOfRotationDate, 'day')) {
      return 0;
    } else {
      // if we are before the start of the rotation, the diff is going to be negative,
      // but we need it positive
      // we also have to change the hours opposite of before, since the order is reversed
      const daysBetween = -date
        .set('hour', 5)
        .diff(dayjs(settings.startOfRotationDate).set('hour', 7), 'days');
      const numberOfFullWeeks = Math.floor(daysBetween / 7);
      const extraDays = daysBetween - numberOfFullWeeks * 7;
      const extraWeekendDays =
        dayjs(date).locale('sk').weekday() + extraDays > 6 ? 2 : 0;
      // there is a reason for the -1s, but I dont remember, but it works
      const dayNumber =
        settings.lengthOfRotation -
        ((daysBetween - 1 - numberOfFullWeeks * 2 - extraWeekendDays) %
          settings.lengthOfRotation) -
        1;
      return dayNumber;
    }
  } else {
    // if we don't skip weekends, it is a lot simpler
    if (date.isAfter(settings.startOfRotationDate)) {
      const daysBetween = date
        .set('hour', 7)
        .diff(dayjs(settings.startOfRotationDate).set('hour', 5), 'days');
      const dayNumber = daysBetween % settings?.lengthOfRotation;
      return dayNumber;
    } else if (date.isSame(settings.startOfRotationDate, 'day')) {
      return 0;
    } else {
      const daysBetween = -date
        .set('hour', 5)
        .diff(dayjs(settings.startOfRotationDate).set('hour', 7), 'days');
      const dayNumber =
        settings?.lengthOfRotation -
        (daysBetween % settings?.lengthOfRotation) -
        1;
      return dayNumber;
    }
  }
};
