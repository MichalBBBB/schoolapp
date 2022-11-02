import dayjs from 'dayjs';
import {LessonFragment, SubjectFragment} from '../generated/graphql';
import {WEEK_DAYS, WEEK_DAY_NUMBERS} from '../types/weekDays';
export const closestLesson = (
  lessons: LessonFragment[],
  subject: SubjectFragment,
) => {
  const subjectLessons = lessons.filter(item => item.subject.id == subject.id);
  subjectLessons.sort((a, b) => {
    return dayjs(getDateOfClosestInstanceOfLesson(a)).diff(
      getDateOfClosestInstanceOfLesson(b),
      'minute',
    );
  });
  return getDateOfClosestInstanceOfLesson(subjectLessons[0]);
};

const getDateOfClosestInstanceOfLesson = (lesson: LessonFragment) => {
  const weekDayNumber =
    WEEK_DAY_NUMBERS[lesson.dayOfTheWeek as keyof typeof WEEK_DAY_NUMBERS];
  if (
    weekDayNumber < dayjs().weekday() ||
    (weekDayNumber == dayjs().weekday() &&
      dayjs(lesson.lessonTime.startTime, 'HH:mm').isBefore(dayjs()))
  ) {
    return dayjs(lesson.lessonTime.startTime, 'HH:mm')
      .weekday(weekDayNumber)
      .add(1, 'week')
      .toDate();
  } else {
    return dayjs(lesson.lessonTime.startTime, 'HH:mm')
      .weekday(weekDayNumber)
      .toDate();
  }
};
