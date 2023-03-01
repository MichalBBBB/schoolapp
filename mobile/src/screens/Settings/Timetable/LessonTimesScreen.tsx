import {NativeStackScreenProps} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Image,
  FlatList,
  TextInput,
} from 'react-native';
import {useTheme} from '../../../contexts/ThemeContext';
import {SettingsStackParamList} from '../../../routes/SettingsStack';
import RelativeTime from 'dayjs/plugin/relativeTime';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';
import SelectTimeModal from '../../../components/selectTimeView/selectTimeModal';
import {
  GetAllLessonTimesDocument,
  LessonTimeFragment,
  useCreateLessonTimeMutation,
  useDeleteLessonTimeMutation,
  useEditLessonTimesMutation,
  useGetAllLessonTimesQuery,
} from '../../../generated/graphql';
import {BasicText} from '../../../components/basicViews/BasicText';
import {BasicButton} from '../../../components/basicViews/BasicButton';
import {BasicCard} from '../../../components/basicViews/BasicCard';
import {BasicTextInput} from '../../../components/basicViews/BasicTextInput';
import {v4 as uuidv4} from 'uuid';
import {useCreateLessonTime} from '../../../mutationHooks/lessonTime/createLessonTime';
import {useDeleteLessonTime} from '../../../mutationHooks/lessonTime/deleteLessonTimes';
import {useEditLessonTimes} from '../../../mutationHooks/lessonTime/editLessonTimes';

export type LessonTime = {
  lessonNumber: number;
  startTime: string;
  endTime: string;
};
dayjs.extend(CustomParseFormat);
dayjs.extend(RelativeTime);

const LessonTimesScreen: React.FC<
  NativeStackScreenProps<SettingsStackParamList, 'LessonTimesScreen'>
> = ({navigation}) => {
  const {data, loading: getLessonTimesLoading} = useGetAllLessonTimesQuery();
  const [createLessonTime] = useCreateLessonTime();
  const [
    editLessonTimes,
    {data: editLessonTimesData, error: editLessonTimesError},
  ] = useEditLessonTimes();
  const [deleteLessonTime] = useDeleteLessonTime();

  const [defaultLessonLength, setDefaultLessonLength] = useState(45);
  const [theme] = useTheme();
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [activeLesson, setActiveLesson] = useState<{
    index: number;
    time: 'start' | 'end';
  } | null>(null);
  const [changingValue, setChangingValue] = useState<number | string>(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerRight: () => (
        <Pressable
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={() => {
            navigation.navigate('TimeTableScreen');
          }}>
          <Text>Continue</Text>
          <Image
            source={require('../../../../assets/Chevron-right.png')}
            style={{height: 25, width: 25, resizeMode: 'stretch'}}
          />
        </Pressable>
      ),
    });
  });

  const getInitialTime = () => {
    let time;
    if (activeLesson) {
      if (activeLesson.time == 'start') {
        time = data?.getAllLessonTimes[activeLesson.index].startTime;
      } else {
        time = data?.getAllLessonTimes[activeLesson.index].endTime;
      }
    } else {
      time = '08:00';
    }
    return time;
  };

  const addLessonTime = (lastLessonTime: LessonTimeFragment) => {
    createLessonTime({
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
    return dayjs(data?.getAllLessonTimes[index + 1].startTime, 'HH:mm').diff(
      dayjs(data?.getAllLessonTimes[index].endTime, 'HH:mm'),
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
      const oldValue = dayjs(
        data?.getAllLessonTimes[index + 1].startTime,
        'HH:mm',
      ).diff(dayjs(data?.getAllLessonTimes[index].endTime, 'HH:mm'), 'minute');
      const difference = parseInt(newValue as string) - oldValue;
      console.log(difference, oldValue, newValue);
      editLessonTimes({
        lessonTimes:
          data?.getAllLessonTimes.slice(index + 1).map((item, itemIndex) => {
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
      editLessonTimes({
        lessonTimes: {
          startTime: newValue as string,
          id: data.getAllLessonTimes[index].id,
          endTime: data.getAllLessonTimes[index].endTime,
        },
      });
    } else if (changedValue == 'lesson-end') {
      if (index == 0 && data.getAllLessonTimes.length == 1) {
        setDefaultLessonLength(
          dayjs(newValue, 'HH:mm').diff(
            dayjs(data.getAllLessonTimes[index].startTime, 'HH:mm'),
            'minute',
          ),
        );
      }
      const oldValue = data.getAllLessonTimes[index].endTime;
      const difference = dayjs(newValue, 'HH:mm').diff(
        dayjs(oldValue, 'HH:mm'),
        'minute',
      );
      const lessonTimeInputs = data.getAllLessonTimes
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
        ListHeaderComponent={() => (
          <View style={styles.listHeaderContainer}>
            <BasicText textVariant="heading" style={{marginBottom: 5}}>
              Enter times of your lessons
            </BasicText>
            <BasicText color="textSecondary" textVariant="subText">
              You can edit this later
            </BasicText>
          </View>
        )}
        style={styles.container}
        data={data?.getAllLessonTimes.map((item, index) => {
          return {...item, lessonNumber: index};
        })}
        ListEmptyComponent={() => (
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <BasicButton
              spacing="m"
              onPress={() => {
                createLessonTime({
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
              backgroundColor="accentBackground">
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
                  <Text>{item.startTime}</Text>
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
                  <BasicText>{item.endTime}</BasicText>
                </BasicButton>
              </View>
              {index == (data?.getAllLessonTimes.length || 1) - 1 && (
                <Pressable
                  onPress={() => {
                    deleteLessonTime({
                      id: item.id,
                    });
                    setActiveLesson(null);
                  }}>
                  <Image
                    style={{resizeMode: 'stretch', height: 30, width: 30}}
                    source={require('../../../../assets/Delete.png')}
                  />
                </Pressable>
              )}
            </BasicCard>
            {index + 1 !== data?.getAllLessonTimes.length ? (
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
                <Image
                  style={{resizeMode: 'stretch', height: 35, width: 35}}
                  source={require('../../../../assets/Plus.png')}
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

export default LessonTimesScreen;
