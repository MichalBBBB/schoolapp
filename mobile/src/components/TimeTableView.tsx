import React, {useMemo} from 'react';
import {
  Pressable,
  Text,
  View,
  ScrollView,
  StyleSheet,
  LayoutAnimation,
} from 'react-native';
import {
  Table,
  Row,
  TableWrapper,
  Col,
  Cell,
} from 'react-native-table-component';
import {useTheme} from '../contexts/ThemeContext';
import {
  useGetAllLessonsQuery,
  LessonFragment,
  useGetAllSchedulesQuery,
  LessonTimeFragment,
} from '../generated/graphql';
import {useCreateLesson} from '../mutationHooks/lesson/createLesson';
import {SettingsStackScreenProps} from '../utils/types';
import {useSettings} from '../utils/useSettings';
import {BasicButton} from './basicViews/BasicButton';
import {BasicIcon} from './basicViews/BasicIcon';
import {BasicText} from './basicViews/BasicText';
import {TimeTableLesson} from './listItems/timetableLesson';
import {SelectSubjectPopup} from './popups/selectSubject/selectSubjectPopup';
import {v4 as uuidv4} from 'uuid';
import dayjs from 'dayjs';
import {Popup} from './popup';
import {Menu} from './menu';
import {MenuItem} from './menu/MenuItem';
import {SchedulesPopup} from './popups/schedulePopup/schedulesPopup';
import {useEditSchedule} from '../mutationHooks/schedule/editSchedule';

const getIndex = <T,>(
  arr: Array<Array<T>>,
  pred: (item: T) => boolean,
): [number, number] | undefined => {
  for (var i = 0; i < arr.length; i++) {
    var index = arr[i].findIndex(pred);
    if (index > -1) {
      return [i, index];
    }
  }
};

export const TimeTableView = () => {
  const {data, loading: lessonsLoading} = useGetAllLessonsQuery();
  const {data: schedules} = useGetAllSchedulesQuery();
  const [createLesson] = useCreateLesson();
  const [editSchedule] = useEditSchedule();

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
    dayNumbers.forEach(item => {
      const schedule = getScheduleOfDay(item);
      tempMap.push(schedule.lessonTimes);
    });
    data?.getAllLessons.forEach(item => {
      if (
        item.dayNumber !== null &&
        item.dayNumber !== undefined &&
        item.dayNumber < tempMap.length
      ) {
        const index = tempMap[item.dayNumber].findIndex(
          mapItem => mapItem.id == item.lessonTime.id,
        );
        tempMap[item.dayNumber] = [...tempMap[item.dayNumber]].map(
          (arrayItem, arrayIndex) => (arrayIndex == index ? item : arrayItem),
        );
      }
    });
    return tempMap;
  }, [data, schedules, settings]);

  const getWidth = (item: LessonFragment | LessonTimeFragment) => {
    if (item.__typename == 'Lesson') {
      const diff = dayjs(item.lessonTime.endTime, 'HH:mm').diff(
        dayjs(item.lessonTime.startTime, 'HH:mm'),
        'm',
      );
      return diff / 0.4;
    } else if (item.__typename == 'LessonTime') {
      const diff = dayjs(item.endTime, 'HH:mm').diff(
        dayjs(item.startTime, 'HH:mm'),
        'm',
      );
      return diff / 0.4;
    } else {
      return 100;
    }
  };

  const getBreakLength = (lessonTime: LessonTimeFragment) => {
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
        ) / 0.4
      );
    }

    return 0;
  };

  if (lessonsLoading) {
    return <Text>Loading...</Text>;
  }
  return (
    <ScrollView style={{flex: 1}} horizontal={true}>
      <ScrollView style={{flex: 1}}>
        {map.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 5,
            }}>
            <View style={{alignItems: 'center', marginHorizontal: 10}}>
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
                }}
                trigger={
                  <BasicButton backgroundColor="accentBackground1" spacing="m">
                    <BasicText style={{maxWidth: 80}} numberOfLines={1}>
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

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {height: 50},
  dataWrapper: {marginTop: -1},
  row: {backgroundColor: '#fff', flexDirection: 'row', height: 80},
});

//
