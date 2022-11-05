import dayjs from 'dayjs';
import React, {useEffect} from 'react';
import {
  View,
  FlatList,
  Text,
  SectionList,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {useEvent} from 'react-native-reanimated';
import {
  CalendarEventFragment,
  LessonFragment,
  useGetAllEventsQuery,
  useGetAllLessonsQuery,
} from '../../generated/graphql';
import {BasicCard} from '../basicViews/BasicCard';
import Event from './event';
import weekday from 'dayjs/plugin/weekday';
import {WEEK_DAY_NUMBERS} from '../../types/weekDays';
import {Lesson} from './lesson';

interface DayEventsProps {
  date: dayjs.Dayjs;
  scrollEnabled: boolean;
}

const DayEvents: React.FC<DayEventsProps> = ({date, scrollEnabled}) => {
  const {data} = useGetAllEventsQuery();
  const {data: lessons} = useGetAllLessonsQuery();

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

  const sections: {
    title: string;
    data: LessonFragment[] | CalendarEventFragment[];
  }[] = [
    {
      title: 'Lessons',
      data: lessonsThisDay,
    },
    {
      title: 'Events',
      data:
        data?.getAllEvents
          .filter(item => dayjs(item.startDate).isSame(date, 'day'))
          .filter(item => {
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
          }) || [],
    },
  ];

  const MySectionList = SectionList<LessonFragment | CalendarEventFragment>;

  return (
    <>
      {/* <FlatList
        data={lessons?.getAllLessons.filter(item => {
          return (
            date.day() ==
            (WEEK_DAY_NUMBERS[
              item.dayOfTheWeek as keyof typeof WEEK_DAY_NUMBERS
            ] as number)
          );
        })}
        renderItem={({item, index}) => (
          <BasicCard>
            <Text>{item.subject.name}</Text>
            <Text>
              {item.lessonTime.startTime} - {item.lessonTime.endTime}
            </Text>
          </BasicCard>
        )}
        scrollEnabled={false}
      /> */}
      <MySectionList
        style={{flex: 1, backgroundColor: 'white', paddingTop: 5}}
        sections={sections}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.sectionTitle}>{title}</Text>
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
                      item.lessonTime.startTime
                  );
                })}
              />
            );
          } else {
            return <Event event={item as CalendarEventFragment} />;
          }
        }}
        renderSectionFooter={() => <View style={styles.sectionFooter}></View>}
        scrollEnabled={scrollEnabled}
        disableVirtualization={true}
      />
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    marginHorizontal: 20,
    color: '#666',
  },
  sectionFooter: {
    height: 15,
  },
});

export default DayEvents;
