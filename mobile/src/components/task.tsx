import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';
import {FlatList, GestureType} from 'react-native-gesture-handler';
import {
  TaskFragment,
  useDeleteTaskMutation,
  useToggleTaskMutation,
} from '../generated/graphql';
import {TaskNavigationProp} from '../utils/types';
import SlidingView from './slidingView';
import calendar from 'dayjs/plugin/calendar';

dayjs.extend(calendar);

export const calendarConfigWithoutTime = {
  sameDay: '[Today]',
  nextDay: '[Tomorrow]',
  nextWeek: 'dddd',
  lastDay: '[Yesterday]',
  lastWeek: '[Last] dddd',
  sameElse: 'DD/MM/YYYY',
};

const Task: React.FC<{
  task: TaskFragment;
}> = ({task}) => {
  const [deleteTask] = useDeleteTaskMutation();
  const navigation = useNavigation<TaskNavigationProp>();
  const [toggleTask] = useToggleTaskMutation();

  const deleteTaskFunc = async () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    await deleteTask({
      variables: {id: task.id},
      update: cache => {
        const normalizedId = cache.identify({id: task.id, __typename: 'Task'});
        cache.evict({id: normalizedId});
      },
    });
  };
  const back = (
    <TouchableOpacity
      onPress={() => {
        deleteTaskFunc();
      }}>
      <View
        style={{
          backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}>
        <Image
          source={require('../../assets/Delete.png')}
          style={{
            resizeMode: 'stretch',
            height: 25,
            width: 25,
          }}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <SlidingView
        frontView={
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('TaskDetailScreen', {task: task});
            }}>
            <View style={styles.container}>
              <TouchableOpacity
                onPress={() => {
                  toggleTask({variables: {id: task.id}});
                }}>
                <Image
                  source={
                    task.done
                      ? require('../../assets/Checkmark.png')
                      : require('../../assets/Circle.png')
                  }
                  style={styles.checkMark}
                />
              </TouchableOpacity>
              <View style={{flex: 1}}>
                <Text style={styles.name}>{task.name}</Text>
                {task.subject?.name && (
                  <Text style={styles.subject}>{task.subject?.name}</Text>
                )}
              </View>
              {task.dueDate && (
                <Text style={styles.dueDate}>
                  {dayjs(task.dueDate).calendar(
                    null,
                    calendarConfigWithoutTime,
                  )}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        }
        backView={[back]}
        backViewWidth={70}
        numberOfBackElements={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  dueDate: {
    color: 'grey',
  },
  subject: {
    color: 'grey',
  },
  name: {},
  checkMark: {
    resizeMode: 'stretch',
    width: 25,
    height: 25,
    marginRight: 10,
  },
  container: {
    padding: 10,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Task;
