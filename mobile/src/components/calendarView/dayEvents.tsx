import dayjs from 'dayjs';
import React, {useEffect} from 'react';
import {View, Text, SectionList, StyleSheet} from 'react-native';
import {
  CalendarEventFragment,
  LessonFragment,
  TaskFragment,
  useGetAllEventsQuery,
  useGetAllLessonsQuery,
  useGetAllTasksQuery,
} from '../../generated/graphql';
import Event from './event';
import {WEEK_DAY_NUMBERS} from '../../types/weekDays';
import {Lesson} from './lesson';
import Task from '../task';
import {BasicText} from '../basicViews/BasicText';

interface DayEventsProps {
  date: dayjs.Dayjs;
  scrollEnabled: boolean;
}

type section = {
  title: string;
  data: LessonFragment[] | CalendarEventFragment[] | TaskFragment[];
};

const DayEvents: React.FC<DayEventsProps> = ({date, scrollEnabled}) => {
  const {data} = useGetAllEventsQuery();
  const {data: lessons} = useGetAllLessonsQuery();
  const {data: tasks} = useGetAllTasksQuery();

  const createSections: () => section[] = () => {
    const lessonsThisDay =
      lessons?.getAllLessons
        .filter(
          item =>
            WEEK_DAY_NUMBERS[
              item.dayOfTheWeek as keyof typeof WEEK_DAY_NUMBERS
            ] == date.weekday(),
        )
        .sort((a, b) => {
          return dayjs(a.lessonTime.startTime, 'HH:mm').diff(
            dayjs(b.lessonTime.startTime, 'HH:mm'),
          );
        }) || [];
    const tasksThisDay =
      tasks?.getAllTasks.filter(item => {
        return dayjs(item.doDate).isSame(dayjs(date), 'date');
      }) || [];
    const eventsThisDay =
      data?.getAllEvents
        .filter(item => dayjs(item.startDate).isSame(date, 'day'))
        .filter(item => {
          //checks whether event is part of a lesson, if it is, it not displayed here
          if (item.subject) {
            const lessonsOfSubject = lessonsThisDay.filter(lesson => {
              return lesson.subject.id == item.subject?.id;
            });
            const lessonOfEvent = lessonsOfSubject.find(lesson => {
              return (
                lesson.lessonTime.startTime ==
                dayjs(item.startDate).format('HH:mm')
              );
            });
            if (lessonOfEvent) {
              return false;
            } else {
              return true;
            }
          } else {
            return true;
          }
        }) || [];
    const sections: section[] = [];
    if (lessonsThisDay.length > 0) {
      sections.push({
        title: 'Lessons',
        data: lessonsThisDay,
      });
    }
    if (eventsThisDay.length > 0) {
      sections.push({
        title: 'Events',
        data: eventsThisDay,
      });
    }
    if (tasksThisDay.length > 0) {
      sections.push({
        title: 'Tasks',
        data: tasksThisDay,
      });
    }
    return sections;
  };

  const MySectionList = SectionList<
    LessonFragment | CalendarEventFragment | TaskFragment
  >;

  return (
    <MySectionList
      ListEmptyComponent={
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: 200,
          }}>
          <BasicText textVariant="heading">Nothing for this day</BasicText>
        </View>
      }
      style={styles.sectionList}
      sections={createSections()}
      renderSectionHeader={({section: {title}}) => (
        <BasicText color="textSecondary" style={styles.sectionTitle}>
          {title}
        </BasicText>
      )}
      renderItem={({item, index}) => {
        if (item.__typename == 'Lesson') {
          return (
            <Lesson
              lesson={item}
              event={data?.getAllEvents.find(event => {
                return (
                  event.subject?.id == item.subject.id &&
                  dayjs(event.startDate).format('HH:mm') ==
                    item.lessonTime.startTime &&
                  dayjs(event.startDate).isSame(date, 'day')
                );
              })}
            />
          );
        } else if (item.__typename == 'CalendarEvent') {
          return <Event event={item} />;
        } else {
          return <Task task={item as TaskFragment} />;
        }
      }}
      renderSectionFooter={() => <View style={styles.sectionFooter}></View>}
      scrollEnabled={scrollEnabled}
      disableVirtualization={true}
    />
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    marginHorizontal: 20,
  },
  sectionFooter: {
    height: 15,
  },
  sectionList: {
    flex: 1,
    paddingTop: 5,
  },
});

export default DayEvents;
