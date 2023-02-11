import dayjs from 'dayjs';
import {LessonFragment, SubjectFragment} from '../generated/graphql';
import {WEEK_DAYS, WEEK_DAY_NUMBERS} from '../types/weekDays';
export const closestLesson = (
  lessons: LessonFragment[],
  subject: SubjectFragment,
) => {
  const subjectLessons = lessons.filter(item => item.subject.id == subject.id);
  if (subjectLessons.length == 0) {
    return null;
  }
  subjectLessons.sort((a, b) => {
    return dayjs(getDateOfClosestInstanceOfLesson(a)).diff(
      getDateOfClosestInstanceOfLesson(b),
      'minute',
    );
  });
  console.log(
    subject.name,
    subjectLessons[0],
    getDateOfClosestInstanceOfLesson(subjectLessons[0]),
  );
  return getDateOfClosestInstanceOfLesson(subjectLessons[0]);
};

const getDateOfClosestInstanceOfLesson = (lesson: LessonFragment) => {
  console.log(lesson);
  const weekDayNumber =
    WEEK_DAY_NUMBERS[lesson.dayOfTheWeek as keyof typeof WEEK_DAY_NUMBERS];
  console.log(weekDayNumber, lesson.dayOfTheWeek);
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

export const getCurrentLesson = (lessons: LessonFragment[]) => {
  const currentLesson = lessons.find(item => {
    const weekDayNumber =
      WEEK_DAY_NUMBERS[item.dayOfTheWeek as keyof typeof WEEK_DAY_NUMBERS];
    return (
      weekDayNumber == dayjs().weekday() &&
      dayjs().isBefore(dayjs(item.lessonTime.endTime, 'HH:mm')) &&
      dayjs().isAfter(dayjs(item.lessonTime.startTime, 'HH:mm'))
    );
  });
  return currentLesson;
};
