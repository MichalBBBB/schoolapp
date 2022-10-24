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
  useCreatelessonTimeMutation,
  useDeleteLessonTimeMutation,
  useEditLessonTimesMutation,
  useGetAllLessonTimesQuery,
} from '../../../generated/graphql';

export type LessonTime = {
  lessonNumber: number;
  startTime: string;
  endTime: string;
};
dayjs.extend(CustomParseFormat);
dayjs.extend(RelativeTime);

// !!!! ids change when state is not reset on new lessonTimes !!!!

const LessonTimesScreen: React.FC<
  NativeStackScreenProps<SettingsStackParamList, 'LessonTimesScreen'>
> = ({navigation}) => {
  // const [lessonTimes, setLessonTimes] = useState<LessonTime[]>([
  //   {lessonNumber: 0, startTime: '08:00', endTime: '08:45'},
  // ]);
  const [theme] = useTheme();
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [activeLesson, setActiveLesson] = useState<{
    index: number;
    time: 'start' | 'end';
  } | null>(null);
  const [changingValue, setChangingValue] = useState<number | string>(0);
  const {data, loading: getLessonTimesLoading} = useGetAllLessonTimesQuery();
  const [createLessonTime] = useCreatelessonTimeMutation();
  const [editLessonTimes, {error: editLessonTimesError}] =
    useEditLessonTimesMutation();
  const [deleteLessonTime] = useDeleteLessonTimeMutation();

  useEffect(() => {
    console.log(JSON.stringify(editLessonTimesError));
  }, [editLessonTimesError]);

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
      variables: {
        startTime: dayjs(lastLessonTime.endTime, 'HH:mm')
          .add(10, 'minute')
          .format('HH:mm'),
        endTime: dayjs(lastLessonTime.endTime, 'HH:mm')
          .add(55, 'minute')
          .format('HH:mm'),
      },
      refetchQueries: [GetAllLessonTimesDocument],
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
        data?.getAllLessonTimes[index].endTime,
        'HH:mm',
      ).diff(
        dayjs(data?.getAllLessonTimes[index + 1].startTime, 'HH:mm'),
        'minute',
      );
      const difference = parseInt(newValue as string) - oldValue;
      editLessonTimes({
        variables: {
          lessonTimes:
            data?.getAllLessonTimes.slice(index).map((item, itemIndex) => {
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
        },
      });
    } else if (changedValue == 'lesson-start') {
      const oldValue = data?.getAllLessonTimes[index].startTime;
      const difference = dayjs(newValue, 'HH:mm').diff(
        dayjs(oldValue, 'HH:mm'),
        'minute',
      );
      editLessonTimes({
        variables: {
          lessonTimes: {
            startTime: newValue as string,
            id: data.getAllLessonTimes[index].id,
            endTime: data.getAllLessonTimes[index].endTime,
          },
        },
      });
    } else if (changedValue == 'lesson-end') {
      const oldValue = data.getAllLessonTimes[index].endTime;
      const difference = dayjs(newValue, 'HH:mm').diff(
        dayjs(oldValue, 'HH:mm'),
        'minute',
      );
      editLessonTimes({
        variables: {
          lessonTimes: data.getAllLessonTimes
            .slice(index)
            .map((item, itemIndex) => {
              if (itemIndex == index) {
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
            }),
        },
        refetchQueries: [GetAllLessonTimesDocument],
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
            <Text style={styles.listHeader}>Enter times of your lessons</Text>
            <Text style={[{color: theme.colors.textSecondary}]}>
              You can edit this later
            </Text>
          </View>
        )}
        style={styles.container}
        data={data?.getAllLessonTimes.map((item, index) => {
          return {...item, lessonNumber: index + 1};
        })}
        ListEmptyComponent={() => (
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Pressable
              style={styles.addFirstLessonButton}
              onPress={() => {
                createLessonTime({
                  variables: {startTime: '08:00', endTime: '08:45'},
                  refetchQueries: [GetAllLessonTimesDocument],
                });
              }}>
              <Text style={styles.addFirstLessonButtonText}>
                Add first lesson
              </Text>
            </Pressable>
          </View>
        )}
        renderItem={({item, index}) => (
          <View style={styles.listItemContainer} key={index}>
            <View
              style={[
                styles.listItem,
                {backgroundColor: theme.colors.accentBackground},
              ]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.lessonNumber}>
                  {item.lessonNumber + 1}.
                </Text>
                <Text>From: </Text>
                <Pressable
                  style={styles.timeContainer}
                  onPress={() => {
                    setActiveLesson({index, time: 'start'});
                    setTimeModalVisible(true);
                  }}>
                  <Text>{item.startTime}</Text>
                </Pressable>
                <Text>To: </Text>
                <Pressable
                  style={styles.timeContainer}
                  onPress={() => {
                    setActiveLesson({index, time: 'end'});
                    setTimeModalVisible(true);
                  }}>
                  <Text>{item.endTime}</Text>
                </Pressable>
              </View>
              {index == (data?.getAllLessonTimes.length || 1) - 1 && (
                <Pressable
                  onPress={() => {
                    deleteLessonTime({
                      variables: {id: item.id},
                      refetchQueries: [GetAllLessonTimesDocument],
                    });
                    setActiveLesson(null);
                  }}>
                  <Image
                    style={{resizeMode: 'stretch', height: 30, width: 30}}
                    source={require('../../../../assets/Delete.png')}
                  />
                </Pressable>
              )}
            </View>
            {index + 1 !== data?.getAllLessonTimes.length ? (
              <View style={styles.break}>
                <TextInput
                  style={styles.breakLength}
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
                <Text>minute break</Text>
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
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  container: {
    padding: 20,
  },
  lessonNumber: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  timeContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#aaa',
    padding: 5,
    marginRight: 10,
  },
  addButton: {
    marginLeft: 10,
    padding: 5,
    marginTop: 5,
  },
  breakLength: {
    marginVertical: 10,
    marginLeft: 20,
    marginRight: 5,
    padding: 3,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#aaa',
  },
  break: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listHeaderContainer: {
    alignItems: 'center',
    paddingBottom: 15,
  },
  listHeader: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 5,
  },
  addFirstLessonButton: {
    borderRadius: 10,
    backgroundColor: 'black',
    color: 'white',
    padding: 10,
  },
  addFirstLessonButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LessonTimesScreen;
