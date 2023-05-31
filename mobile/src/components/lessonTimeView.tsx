import React, {useEffect} from 'react';
import dayjs from 'dayjs';
import {useState, useLayoutEffect} from 'react';
import {Pressable, Text, FlatList, View, Image, StyleSheet} from 'react-native';
import {
  LessonTimeFragment,
  useGetAllSchedulesQuery,
} from '../generated/graphql';
import {useCreateLessonTime} from '../mutationHooks/lessonTime/createLessonTime';
import {useDeleteLessonTime} from '../mutationHooks/lessonTime/deleteLessonTimes';
import {useEditLessonTimes} from '../mutationHooks/lessonTime/editLessonTimes';
import {BasicButton} from './basicViews/BasicButton';
import {BasicCard} from './basicViews/BasicCard';
import {BasicIcon} from './basicViews/BasicIcon';
import {BasicText} from './basicViews/BasicText';
import {BasicTextInput} from './basicViews/BasicTextInput';
import SelectTimeModal from './modals/selectTimeView/selectTimeModal';
import {v4 as uuidv4} from 'uuid';

export type LessonTime = {
  lessonNumber: number;
  startTime: string;
  endTime: string;
};

interface LessonTimesViewProps {
  scheduleId: string;
}

export const LessonTimesView: React.FC<LessonTimesViewProps> = ({
  scheduleId,
}) => {
  const {data: schedules, loading: getLessonTimesLoading} =
    useGetAllSchedulesQuery();
  const data =
    schedules?.getAllSchedules.find(item => item.id == scheduleId)!
      .lessonTimes || [];
  const [createLessonTime] = useCreateLessonTime();
  const [editLessonTimes] = useEditLessonTimes();
  const [deleteLessonTime] = useDeleteLessonTime();

  const [defaultLessonLength, setDefaultLessonLength] = useState(45);
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [activeLesson, setActiveLesson] = useState<{
    index: number;
    time: 'start' | 'end';
  } | null>(null);
  const [changingValue, setChangingValue] = useState<number | string>(0);

  // get the time for the select time modal
  const getInitialTime = () => {
    let time;
    if (activeLesson) {
      if (activeLesson.time == 'start') {
        time = data[activeLesson.index].startTime;
      } else {
        time = data[activeLesson.index].endTime;
      }
    } else {
      time = '08:00';
    }
    return time;
  };

  const addLessonTime = (lastLessonTime: LessonTimeFragment) => {
    createLessonTime({
      scheduleId,
      id: uuidv4(),
      startTime: dayjs(lastLessonTime.endTime, 'HH:mm')
        .add(10, 'minute')
        .format('HH:mm'),
      endTime: dayjs(lastLessonTime.endTime, 'HH:mm')
        .add(10 + defaultLessonLength, 'minute')
        .format('HH:mm'),
    });
  };

  const getBreakLength = (index: number) => {
    return dayjs(data[index + 1].startTime, 'HH:mm').diff(
      dayjs(data[index].endTime, 'HH:mm'),
      'minute',
    );
  };

  const shift = (
    changedValue: 'lesson-start' | 'lesson-end' | 'break',
    index: number,
    newValue: number | string,
  ) => {
    if (!data) {
      return;
    }
    if (changedValue == 'break') {
      const oldValue = dayjs(data[index + 1].startTime, 'HH:mm').diff(
        dayjs(data[index].endTime, 'HH:mm'),
        'minute',
      );
      const difference = parseInt(newValue as string) - oldValue;
      console.log(difference, oldValue, newValue);
      editLessonTimes({
        lessonTimes:
          data?.slice(index + 1).map((item, itemIndex) => {
            return {
              id: item.id,
              startTime: dayjs(item.startTime, 'HH:mm')
                .add(difference, 'minute')
                .format('HH:mm'),
              endTime: dayjs(item.endTime, 'HH:mm')
                .add(difference, 'minute')
                .format('HH:mm'),
            };
          }) || [],
      });
    } else if (changedValue == 'lesson-start') {
      if (index > 0) {
        if (
          dayjs(newValue, 'HH:mm').isBefore(
            dayjs(data[index - 1].endTime, 'HH:mm'),
          )
        ) {
          return;
        }
      }
      if (
        dayjs(newValue, 'HH:mm').isAfter(dayjs(data[index].endTime, 'HH:mm'))
      ) {
        const lengthOfLesson = dayjs(data[index].endTime, 'HH:mm').diff(
          dayjs(data[index].startTime, 'HH:mm'),
          'minute',
        );
        console.log(lengthOfLesson);
        editLessonTimes({
          lessonTimes: {
            startTime: newValue as string,
            id: data[index].id,
            endTime: dayjs(newValue, 'HH:mm')
              .add(lengthOfLesson, 'minute')
              .format('HH:mm'),
          },
        });
      } else {
        editLessonTimes({
          lessonTimes: {
            startTime: newValue as string,
            id: data[index].id,
            endTime: data[index].endTime,
          },
        });
      }
    } else if (changedValue == 'lesson-end') {
      if (index == 0 && data.length == 1) {
        setDefaultLessonLength(
          dayjs(newValue, 'HH:mm').diff(
            dayjs(data[index].startTime, 'HH:mm'),
            'minute',
          ),
        );
      }
      const oldValue = data[index].endTime;
      const difference = dayjs(newValue, 'HH:mm').diff(
        dayjs(oldValue, 'HH:mm'),
        'minute',
      );
      const lessonTimeInputs = data
        .slice(index, undefined)
        .map((item, itemIndex) => {
          console.log(index, itemIndex, item);
          if (itemIndex == 0) {
            return {
              startTime: item.startTime,
              id: item.id,
              endTime: dayjs(item.endTime, 'HH:mm')
                .add(difference, 'minute')
                .format('HH:mm'),
            };
          } else {
            return {
              id: item.id,
              endTime: dayjs(item.endTime, 'HH:mm')
                .add(difference, 'minute')
                .format('HH:mm'),
              startTime: dayjs(item.startTime, 'HH:mm')
                .add(difference, 'minute')
                .format('HH:mm'),
            };
          }
        });
      editLessonTimes({
        lessonTimes: lessonTimeInputs,
      });
    }
  };

  if (!data && getLessonTimesLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <FlatList
        contentContainerStyle={styles.container}
        data={data?.map((item, index) => {
          return {...item, lessonNumber: index};
        })}
        ListEmptyComponent={() => (
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <BasicButton
              spacing="m"
              onPress={() => {
                createLessonTime({
                  scheduleId,
                  id: uuidv4(),
                  startTime: '08:00',
                  endTime: '08:45',
                });
              }}>
              <BasicText color="textContrast" textVariant="button">
                Add first lesson
              </BasicText>
            </BasicButton>
          </View>
        )}
        renderItem={({item, index}) => (
          <View style={styles.listItemContainer} key={index}>
            <BasicCard
              style={[styles.listItem]}
              spacing="m"
              backgroundColor="accentBackground1">
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <BasicText style={styles.lessonNumber} textVariant="button">
                  {item.lessonNumber + 1}.
                </BasicText>
                <BasicText>From: </BasicText>
                <BasicButton
                  variant="outlined"
                  backgroundColor="lightBorder"
                  borderRadius={5}
                  borderWidth={1}
                  style={{marginRight: 10}}
                  onPress={() => {
                    setActiveLesson({index, time: 'start'});
                    setTimeModalVisible(true);
                  }}>
                  <BasicText>
                    {dayjs(item.startTime, 'HH:mm').format('LT')}
                  </BasicText>
                </BasicButton>
                <BasicText>To: </BasicText>
                <BasicButton
                  variant="outlined"
                  backgroundColor="lightBorder"
                  borderRadius={5}
                  borderWidth={1}
                  onPress={() => {
                    setActiveLesson({index, time: 'end'});
                    setTimeModalVisible(true);
                  }}>
                  <BasicText>
                    {dayjs(item.endTime, 'HH:mm').format('LT')}
                  </BasicText>
                </BasicButton>
              </View>
              {index == (data?.length || 1) - 1 && (
                <Pressable
                  onPress={() => {
                    deleteLessonTime({
                      id: item.id,
                    });
                    setActiveLesson(null);
                  }}>
                  <Image
                    style={{resizeMode: 'stretch', height: 30, width: 30}}
                    source={require('../../assets/Delete.png')}
                  />
                </Pressable>
              )}
            </BasicCard>
            {index + 1 !== data?.length ? (
              <View style={styles.break}>
                <BasicTextInput
                  style={{
                    marginVertical: 10,
                    marginLeft: 20,
                    marginRight: 5,
                    padding: 3,
                  }}
                  variant="outlined"
                  borderWidth={1}
                  backgroundColor="lightBorder"
                  borderRadius={5}
                  defaultValue={getBreakLength(index).toString()}
                  keyboardType="numeric"
                  returnKeyType="done"
                  onChangeText={value => setChangingValue(value)}
                  onSubmitEditing={() => {
                    shift('break', index, changingValue);
                    setChangingValue(0);
                  }}
                  onFocus={() => {
                    setChangingValue(getBreakLength(index));
                  }}
                  selectTextOnFocus={true}
                />
                <BasicText>minute break</BasicText>
              </View>
            ) : (
              <Pressable
                style={styles.addButton}
                onPress={() => {
                  addLessonTime(item);
                }}>
                <BasicIcon
                  style={{resizeMode: 'stretch', height: 35, width: 35}}
                  source={require('../../assets/Plus.png')}
                />
              </Pressable>
            )}
          </View>
        )}
      />
      <SelectTimeModal
        isVisible={timeModalVisible}
        onClose={() => setTimeModalVisible(false)}
        onSubmit={time => {
          shift(
            activeLesson?.time == 'start' ? 'lesson-start' : 'lesson-end',
            activeLesson?.index as number,
            time,
          );
          setTimeModalVisible(false);
        }}
        initialTime={getInitialTime()}
      />
    </>
  );
};

const styles = StyleSheet.create({
  listItemContainer: {
    alignItems: 'flex-start',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  lessonNumber: {
    marginRight: 10,
  },
  addButton: {
    marginLeft: 10,
    padding: 5,
    marginTop: 5,
  },
  break: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listHeaderContainer: {
    alignItems: 'center',
    paddingBottom: 15,
  },
});
