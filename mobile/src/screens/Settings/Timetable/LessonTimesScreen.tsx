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
  useCreateLessonTimesMutation,
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
  const [lessonTimes, setLessonTimes] = useState<LessonTime[]>([
    {lessonNumber: 0, startTime: '08:00', endTime: '08:45'},
  ]);
  const [theme] = useTheme();
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [activeLesson, setActiveLesson] = useState<{
    index: number;
    time: 'start' | 'end';
  } | null>(null);
  const [changingValue, setChangingValue] = useState<number | string>(0);
  const {data} = useGetAllLessonTimesQuery();
  const [createLessonTimes] = useCreateLessonTimesMutation();

  useEffect(() => {
    console.log('useEffect');
    console.log(data?.getAllLessonTimes);
    if (data?.getAllLessonTimes && data.getAllLessonTimes.length >= 1) {
      setLessonTimes(
        data?.getAllLessonTimes.map(item => {
          return {
            startTime: item.startTime,
            endTime: item.endTime,
            lessonNumber: item.lessonNumber,
            id: item.id,
          };
        }),
      );
    }
  }, []);

  const saveLessonTimes = async () => {
    console.log('save', lessonTimes);
    const result = await createLessonTimes({
      variables: {
        lessonTimes,
      },
      refetchQueries: [GetAllLessonTimesDocument],
    });
    console.log(result.errors);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerRight: () => (
        <Pressable
          style={{flexDirection: 'row', alignItems: 'center'}}
          onPress={() => {
            saveLessonTimes();
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
        time = lessonTimes[activeLesson.index].startTime;
      } else {
        time = lessonTimes[activeLesson.index].endTime;
      }
    } else {
      time = '08:00';
    }
    return time;
  };

  const getBreakLength = (index: number) => {
    return dayjs(lessonTimes[index + 1].startTime, 'HH:mm').diff(
      dayjs(lessonTimes[index].endTime, 'HH:mm'),
      'minute',
    );
  };

  const shift = (
    changedValue: 'lesson-start' | 'lesson-end' | 'break',
    index: number,
    newValue: number | string,
  ) => {
    if (changedValue == 'break') {
      const oldValue = dayjs(lessonTimes[index].endTime, 'HH:mm').diff(
        dayjs(lessonTimes[index + 1].startTime, 'HH:mm'),
        'minute',
      );
      const difference = parseInt(newValue as string) - oldValue;
      setLessonTimes(
        lessonTimes.map((item, itemIndex) => {
          if (itemIndex > index) {
            return {
              ...item,
              startTime: dayjs(item.startTime, 'HH:mm')
                .add(difference, 'minute')
                .format('HH:mm'),
              endTime: dayjs(item.endTime, 'HH:mm')
                .add(difference, 'minute')
                .format('HH:mm'),
            };
          } else {
            return item;
          }
        }),
      );
    } else if (changedValue == 'lesson-start') {
      const oldValue = lessonTimes[index].startTime;
      const difference = dayjs(newValue, 'HH:mm').diff(
        dayjs(oldValue, 'HH:mm'),
        'minute',
      );
      setLessonTimes(
        lessonTimes.map((item, itemIndex) => {
          if (itemIndex == index) {
            return {
              ...item,
              startTime: newValue as string,
            };
          } else {
            return item;
          }
        }),
      );
    } else if (changedValue == 'lesson-end') {
      const oldValue = lessonTimes[index].endTime;
      const difference = dayjs(newValue, 'HH:mm').diff(
        dayjs(oldValue, 'HH:mm'),
        'minute',
      );
      setLessonTimes(
        lessonTimes.map((item, itemIndex) => {
          if (itemIndex > index) {
            return {
              ...item,
              endTime: dayjs(item.endTime, 'HH:mm')
                .add(difference, 'minute')
                .format('HH:mm'),
              startTime: dayjs(item.startTime, 'HH:mm')
                .add(difference, 'minute')
                .format('HH:mm'),
            };
          } else if (itemIndex == index) {
            return {
              ...item,
              endTime: dayjs(item.endTime, 'HH:mm')
                .add(difference, 'minute')
                .format('HH:mm'),
            };
          } else {
            return item;
          }
        }),
      );
    }
  };

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
        data={lessonTimes}
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
              {index == lessonTimes.length - 1 && (
                <Pressable
                  onPress={() => {
                    setLessonTimes(lessonTimes.slice(0, index));
                  }}>
                  <Image
                    style={{resizeMode: 'stretch', height: 30, width: 30}}
                    source={require('../../../../assets/Delete.png')}
                  />
                </Pressable>
              )}
            </View>
            {index + 1 !== lessonTimes.length ? (
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
                  setLessonTimes([
                    ...lessonTimes,
                    {
                      lessonNumber: lessonTimes.length,
                      startTime: dayjs(item.endTime, 'HH:mm')
                        .add(10, 'minute')
                        .format('HH:mm'),
                      endTime: dayjs(item.endTime, 'HH:mm')
                        .add(55, 'minute')
                        .format('HH:mm'),
                    },
                  ]);
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
});

export default LessonTimesScreen;
