import React, {useEffect, useMemo, useState} from 'react';
import {Text, View, ScrollView, LayoutAnimation} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';
import {
  useGetAllLessonsQuery,
  LessonFragment,
  useGetAllSchedulesQuery,
  LessonTimeFragment,
} from '../generated/graphql';
import {useCreateLesson} from '../mutationHooks/lesson/createLesson';
import {useSettings} from '../utils/hooks/useSettings';
import {BasicButton} from './basicViews/BasicButton';
import {BasicIcon} from './basicViews/BasicIcon';
import {BasicText} from './basicViews/BasicText';
import {TimeTableLesson} from './listItems/timetableLesson';
import {SelectSubjectPopup} from './popups/selectSubject/selectSubjectPopup';
import {v4 as uuidv4} from 'uuid';
import dayjs from 'dayjs';
import {SchedulesPopup} from './popups/schedulePopup/schedulesPopup';
import {useEditSchedule} from '../mutationHooks/schedule/editSchedule';
import {useDeleteLesson} from '../mutationHooks/lesson/deleteLesson';

const widthConstant = 2.5;

export const TimeTableView = () => {
  const {data, loading: lessonsLoading} = useGetAllLessonsQuery();
  const {data: schedules} = useGetAllSchedulesQuery();
  const [createLesson] = useCreateLesson();
  const [editSchedule] = useEditSchedule();
  const [deleteLesson] = useDeleteLesson();

  const [isLoaded, setIsLoaded] = useState(false);

  const [theme] = useTheme();

  const settings = useSettings();

  const getScheduleOfDay = (dayNumber: number) => {
    const assignedSchedule = schedules?.getAllSchedules.find(item =>
      item.dayNumbers?.includes(dayNumber),
    );
    if (assignedSchedule) {
      return assignedSchedule;
    } else {
      return schedules?.getAllSchedules.find(item => item.default)!;
    }
  };

  const dayNumbers = Array(settings?.lengthOfRotation)
    .fill(0)
    .map((item, index) => index);

  const map = useMemo(() => {
    var tempMap: Array<Array<LessonFragment | LessonTimeFragment>> = [];
    // we populate the map with only lessonTimes
    dayNumbers.forEach(item => {
      const schedule = getScheduleOfDay(item);
      tempMap.push(schedule.lessonTimes);
    });
    // we go through all lessons, find their location and replace the lessonTime with the lesson
    data?.getAllLessons.forEach(item => {
      if (
        item.dayNumber !== null &&
        item.dayNumber !== undefined &&
        item.dayNumber < tempMap.length
      ) {
        const index = tempMap[item.dayNumber].findIndex(
          mapItem => mapItem.id == item.lessonTime.id,
        );
        // assigning a value directly to the map didn't work,
        // so we just assign the whole row
        tempMap[item.dayNumber] = [...tempMap[item.dayNumber]].map(
          (arrayItem, arrayIndex) => (arrayIndex == index ? item : arrayItem),
        );
      }
    });
    return tempMap;
  }, [data, schedules, settings]);

  const earliestTime = useMemo(() => {
    // get the schedules that are actually displayed in the timetable
    const activeSchedules = [
      schedules?.getAllSchedules.find(item => item.default),
      ...(schedules?.getAllSchedules.filter(item => {
        return (
          item.dayNumbers &&
          item.dayNumbers.some(
            dayNumber => dayNumber < (settings?.lengthOfRotation || 5) - 1,
          )
        );
      }) || []),
    ];
    var earliestTime = '08:00';
    // go through every lessonTime and change the earliest time, if the lessonTime is earlier
    activeSchedules.forEach(item => {
      item?.lessonTimes.forEach(lessonTime => {
        if (
          dayjs(lessonTime.startTime, 'HH:mm').isBefore(
            dayjs(earliestTime, 'HH:mm'),
          )
        ) {
          earliestTime = lessonTime.startTime;
        }
      });
    });
    return earliestTime;
  }, [schedules, settings]);

  const latestTime = useMemo(() => {
    // get the schedules that are actually displayed in the timetable
    const activeSchedules = [
      schedules?.getAllSchedules.find(item => item.default),
      ...(schedules?.getAllSchedules.filter(item => {
        return (
          item.dayNumbers &&
          item.dayNumbers.some(
            dayNumber => dayNumber < (settings?.lengthOfRotation || 5) - 1,
          )
        );
      }) || []),
    ];
    var latestTime = '14:00';
    // go through every lessonTime and change the earliest time, if the lessonTime is later
    activeSchedules.forEach(item => {
      item?.lessonTimes.forEach(lessonTime => {
        if (
          dayjs(lessonTime.endTime, 'HH:mm').isAfter(dayjs(latestTime, 'HH:mm'))
        ) {
          latestTime = lessonTime.endTime;
        }
      });
    });
    return latestTime;
  }, [schedules, settings]);

  // get the width of an element based on the length of the lessonTime
  const getWidth = (item: LessonFragment | LessonTimeFragment) => {
    if (item.__typename == 'Lesson') {
      const diff = dayjs(item.lessonTime.endTime, 'HH:mm').diff(
        dayjs(item.lessonTime.startTime, 'HH:mm'),
        'm',
      );
      return diff * widthConstant;
    } else if (item.__typename == 'LessonTime') {
      const diff = dayjs(item.endTime, 'HH:mm').diff(
        dayjs(item.startTime, 'HH:mm'),
        'm',
      );
      return diff * widthConstant;
    } else {
      return 100;
    }
  };

  // get the time between two lessonTimes
  const getBreakLength = (lessonTime: LessonTimeFragment) => {
    // get all other lessonTimes from that schedule and sort them
    const lessonTimes = [
      ...(schedules?.getAllSchedules.find(
        item => item.id == lessonTime.scheduleId,
      )?.lessonTimes || []),
    ];
    lessonTimes.sort((a, b) => {
      return dayjs(a.startTime, 'HH:mm').diff(dayjs(b.startTime, 'HH:mm'), 'm');
    });
    const index = lessonTimes.findIndex(item => item.id == lessonTime.id);
    if (index == lessonTimes.length - 1) {
      return 0;
    } else {
      const nextLessonTime = lessonTimes[index + 1];
      return (
        dayjs(nextLessonTime.startTime, 'HH:mm').diff(
          dayjs(lessonTime.endTime, 'HH:mm'),
          'minute',
        ) * widthConstant
      );
    }
  };

  // get the offest of the first lessonTime
  const getFirstOffset = (row: Array<LessonFragment | LessonTimeFragment>) => {
    if (row.length > 0) {
      const item = row[0];
      if (item.__typename == 'Lesson') {
        return (
          dayjs(item.lessonTime.startTime, 'HH:mm').diff(
            dayjs(earliestTime, 'HH:mm'),
            'm',
          ) * widthConstant
        );
      } else {
        return (
          dayjs((item as LessonTimeFragment).startTime, 'HH:mm').diff(
            dayjs(earliestTime, 'HH:mm'),
            'm',
          ) * widthConstant
        );
      }
    } else {
      return 0;
    }
  };

  const topTimes = useMemo(() => {
    const earliestHour = parseInt(earliestTime.split(':')[0]) + 1;
    const latestHour = parseInt(latestTime.split(':')[0]);
    const times = [];
    for (var i = earliestHour; i <= latestHour; i++) {
      times.push(i.toString() + ':00');
    }
    return times;
  }, [earliestTime, schedules]);

  if (lessonsLoading || map.length == 0) {
    return <Text>Loading...</Text>;
  }
  return (
    <ScrollView style={{flex: 1}} horizontal={true}>
      <ScrollView style={{flex: 1}}>
        <View
          style={{
            position: 'absolute',
            flexDirection: 'row',
            height: '100%',
            paddingLeft:
              140 + (60 - parseInt(earliestTime.split(':')[1])) * widthConstant,
          }}>
          {topTimes.map((item, index) => (
            <View
              key={index}
              style={{
                height: '100%',
                width: 1,
                backgroundColor: theme.colors.border,
                marginRight: 60 * widthConstant - 1,
                marginTop: 20,
              }}
            />
          ))}
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingLeft:
              140 + (60 - parseInt(earliestTime.split(':')[1])) * widthConstant,
            marginBottom: 10,
          }}>
          {topTimes.map((item, index) => (
            <BasicText
              key={index}
              style={{
                marginRight: 60 * widthConstant - 50,
                width: 50,
                transform: [{translateX: -25}],
                textAlign: 'center',
              }}>
              {item}
            </BasicText>
          ))}
        </View>
        {map.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              // marginBottom: 5,
              paddingVertical: 5,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.border,
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 10,
                width: 130,
                minHeight: 80,
                marginRight: 10 + getFirstOffset(row),
              }}>
              <BasicText style={{marginBottom: 5}}>{`Day ${
                rowIndex + 1
              }`}</BasicText>
              <SchedulesPopup
                selectedScheduleId={getScheduleOfDay(rowIndex).id}
                onSubmit={schedule => {
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut,
                  );
                  const previousSchedule = schedules?.getAllSchedules.find(
                    item => item.dayNumbers?.includes(rowIndex),
                  );
                  if (previousSchedule) {
                    editSchedule({
                      id: previousSchedule.id,
                      dayNumbers: previousSchedule.dayNumbers?.filter(
                        item => item !== rowIndex,
                      ),
                    });
                  }
                  if (!schedule.default) {
                    editSchedule({
                      id: schedule.id,
                      dayNumbers: [...(schedule.dayNumbers || []), rowIndex],
                    });
                  }
                  data?.getAllLessons.forEach(item => {
                    if (item.dayNumber == rowIndex) {
                      deleteLesson({id: item.id});
                    }
                  });
                }}
                trigger={
                  <BasicButton backgroundColor="accentBackground1" spacing="m">
                    <BasicText numberOfLines={1} style={{textAlign: 'center'}}>
                      {getScheduleOfDay(rowIndex).name}
                    </BasicText>
                  </BasicButton>
                }
              />
            </View>
            {row.map((item, index) => (
              <View
                key={index}
                style={{
                  height: 100,
                  width: getWidth(item),
                  padding: 2,
                  marginRight: getBreakLength(
                    item.__typename == 'Lesson'
                      ? item.lessonTime
                      : (item as LessonTimeFragment),
                  ),
                }}>
                {item.__typename == 'Lesson' ? (
                  <TimeTableLesson lesson={item} />
                ) : (
                  <View
                    style={{
                      width: '100%',
                      height: '100%',
                    }}>
                    <SelectSubjectPopup
                      onSubmit={subject => {
                        if (subject) {
                          createLesson({
                            id: uuidv4(),
                            lessonTimeId: item.id,
                            dayNumber: rowIndex,
                            subjectId: subject.id,
                          });
                        }
                      }}
                      trigger={
                        <BasicButton
                          style={{width: '100%', height: '100%'}}
                          backgroundColor="accentBackground1"
                          spacing="m">
                          <BasicText>Add</BasicText>
                        </BasicButton>
                      }
                    />
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
};
