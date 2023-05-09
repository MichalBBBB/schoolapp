import React, {useMemo} from 'react';
import {Pressable, Text, View, ScrollView, StyleSheet} from 'react-native';
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
  }, [data, schedules]);

  const getWidth = (item: LessonFragment | LessonTimeFragment) => {
    if (item.__typename == 'Lesson') {
      const diff = dayjs(item.lessonTime.endTime, 'HH:mm').diff(
        dayjs(item.lessonTime.startTime, 'HH:mm'),
        'm',
      );
      return diff / 0.6;
    } else if (item.__typename == 'LessonTime') {
      const diff = dayjs(item.endTime, 'HH:mm').diff(
        dayjs(item.startTime, 'HH:mm'),
        'm',
      );
      return diff / 0.6;
    } else {
      return 100;
    }
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
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <BasicText style={{marginHorizontal: 10}}>{`Day ${
              rowIndex + 1
            }`}</BasicText>
            {row.map((item, index) => (
              <View key={index} style={{height: 100, width: getWidth(item)}}>
                {item.__typename == 'Lesson' ? (
                  <TimeTableLesson lesson={item} />
                ) : (
                  <View
                    style={{
                      width: '100%',
                      height: '100%',
                      padding: 2,
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
