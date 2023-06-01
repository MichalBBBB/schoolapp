import dayjs from 'dayjs';
import React, {memo, useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  CalendarEventFragment,
  LessonFragment,
  useGetAllEventsQuery,
  useGetAllLessonsQuery,
} from '../../generated/graphql';
import Event from './event';
import {Lesson} from './lesson';
import {useSettings} from '../../utils/useSettings';
import {getDayNumber} from '../../utils/lessonUtils';
import {useGetSpecialScheduleForDay} from '../../utils/useSpecialScheduleForDay';
import {EventBlock, getEventBlocks} from '../../utils/eventMap';
import {getEnd, getStart} from '../../utils/eventUtils';
import {useNavigation} from '@react-navigation/native';
import {CalendarNavigationProp} from '../../utils/types';
import {BasicRefreshControl} from '../basicViews/BasicRefreshControl';
import {replaceAllData} from '../../Content';
import {useApolloClient} from '@apollo/client';
import {BasicText} from '../basicViews/BasicText';
import {useTheme} from '../../contexts/ThemeContext';

export const width = Dimensions.get('screen').width;

const heightConstant = 2;

interface DayEventsProps {
  date: dayjs.Dayjs;
  scrollEnabled: boolean;
}

const DayView: React.FC<DayEventsProps> = ({date, scrollEnabled}) => {
  const {data} = useGetAllEventsQuery();
  const {data: lessons} = useGetAllLessonsQuery();
  const navigation = useNavigation<CalendarNavigationProp>();
  const specialSchedule = useGetSpecialScheduleForDay(date);

  const [refreshing, setRefreshing] = useState(false);

  const client = useApolloClient();

  const [theme] = useTheme();

  const settings = useSettings();

  const dayNumber = useMemo(() => {
    if (settings) {
      return getDayNumber(date, settings);
    } else {
      return -1;
    }
  }, [date, settings]);

  const blocks = useMemo(() => {
    var lessonsThisDay =
      lessons?.getAllLessons
        .filter(item => {
          return dayNumber == item.dayNumber;
        })
        .sort((a, b) => {
          return dayjs(a.lessonTime.startTime, 'HH:mm').diff(
            dayjs(b.lessonTime.startTime, 'HH:mm'),
          );
        }) || [];
    if (specialSchedule) {
      lessonsThisDay =
        lessons?.getAllLessons
          .filter(item => dayjs(item.date).isSame(date, 'day'))
          .sort((a, b) => {
            return dayjs(a.lessonTime.startTime, 'HH:mm').diff(
              dayjs(b.lessonTime.startTime, 'HH:mm'),
            );
          }) || [];
    }
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
    const result = getEventBlocks(date, eventsThisDay, lessonsThisDay);
    return result;
  }, [data, lessons]);

  // get the width of an element based on the length of the lessonTime
  const getHeight = (item: LessonFragment | CalendarEventFragment) => {
    if (item.__typename == 'Lesson') {
      const diff = getEnd(item, date).diff(getStart(item, date), 'm');
      return diff * heightConstant;
    } else if (item.__typename == 'CalendarEvent') {
      const diff = dayjs(item.endDate).diff(dayjs(item.startDate), 'm');
      return diff * heightConstant;
    } else {
      return 100;
    }
  };

  const getOffset = (
    item: LessonFragment | CalendarEventFragment,
    block: EventBlock,
    columnIndex: number,
    itemIndex: number,
  ) => {
    if (itemIndex == 0) {
      const diff = getStart(item, date).diff(block.startTime, 'm');
      return diff * heightConstant;
    } else {
      return (
        getStart(item, date).diff(
          getEnd(block.columns[columnIndex][itemIndex - 1], date),
          'm',
        ) * heightConstant
      );
    }
  };

  const getBlockOffset = (blockIndex: number) => {
    if (blockIndex == 0) {
      return 0;
    } else {
      const diff = blocks[blockIndex].startTime.diff(
        blocks[blockIndex - 1].endTime,
        'm',
      );

      return diff * heightConstant;
    }
  };

  const sideTimes = useMemo(() => {
    if (blocks.length > 0) {
      const earliestTime = blocks[0].startTime;
      const latestTime = blocks[blocks.length - 1].endTime;
      const earliestHour = earliestTime.hour() + 1;
      const latestHour = latestTime.hour();
      const times = [];
      for (var i = earliestHour; i <= latestHour + 1; i++) {
        times.push(i.toString() + ':00');
      }
      return times;
    } else {
      return [];
    }
  }, [blocks]);

  return (
    <>
      <ScrollView
        scrollEnabled={scrollEnabled}
        style={{width}}
        contentContainerStyle={{
          paddingHorizontal: 5,
          paddingTop: 10,
          paddingBottom: 50,
        }}
        refreshControl={
          <BasicRefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              replaceAllData(client).then(() => {
                setRefreshing(false);
              });
            }}
          />
        }>
        {blocks.length > 0 ? (
          <>
            <View
              style={{
                width: '100%',
                position: 'absolute',
                paddingTop:
                  (60 - blocks[0].startTime.minute()) * heightConstant,
              }}>
              {sideTimes.map((item, index) => (
                <View
                  key={index}
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: theme.colors.border,
                    marginBottom: 60 * heightConstant - 1,
                    marginLeft: 45,
                  }}
                />
              ))}
            </View>
            <View
              style={{
                position: 'absolute',
                paddingTop:
                  (60 - blocks[0].startTime.minute()) * heightConstant,
              }}>
              {sideTimes.map((item, index) => (
                <View
                  key={index}
                  style={{
                    marginBottom: 60 * heightConstant - 30,
                    marginLeft: 5,
                    height: 30,
                    transform: [{translateY: -15}],
                    justifyContent: 'center',
                  }}>
                  <BasicText
                    color="textSecondary"
                    style={{
                      textAlign: 'center',
                    }}>
                    {item}
                  </BasicText>
                </View>
              ))}
            </View>
            {blocks.map((block, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  marginTop: getBlockOffset(index),
                  marginLeft: 35,
                }}>
                {block.columns.map((column, columnIndex) => (
                  <View style={{flex: 1}} key={columnIndex}>
                    {column.map((item, itemIndex) => (
                      <View
                        key={itemIndex}
                        style={{
                          marginTop: getOffset(
                            item,
                            block,
                            columnIndex,
                            itemIndex,
                          ),
                          marginHorizontal: 5,
                        }}>
                        {item.__typename == 'Lesson' ? (
                          <Lesson
                            navigation={navigation}
                            lesson={item}
                            height={getHeight(item)}
                            variant="calendar"
                            event={data?.getAllEvents.find(event => {
                              return (
                                event.subject?.id == item.subject?.id &&
                                dayjs(event.startDate).format('HH:mm') ==
                                  item.lessonTime.startTime &&
                                dayjs(event.startDate).isSame(date, 'day')
                              );
                            })}
                            onEventPress={event => {
                              navigation.navigate('EventDetailScreen', {event});
                            }}
                          />
                        ) : (
                          <Event
                            event={item as CalendarEventFragment}
                            height={getHeight(item)}
                            variant="calendar"
                          />
                        )}
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            ))}
          </>
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 200,
            }}>
            <BasicText textVariant="heading">Nothing for this day</BasicText>
            {specialSchedule && (
              <BasicText color="textSecondary">Special Schedule</BasicText>
            )}
          </View>
        )}
      </ScrollView>
    </>
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

export default memo(DayView);
