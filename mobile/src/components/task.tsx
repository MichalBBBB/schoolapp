import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View, LayoutAnimation} from 'react-native';
import {
  TaskFragment,
  useDeleteTaskMutation,
  useToggleTaskMutation,
} from '../generated/graphql';
import {TaskNavigationProp} from '../utils/types';
import SlidingView from './slidingView';
import calendar from 'dayjs/plugin/calendar';
import {BasicText} from './basicViews/BasicText';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useToggleTask} from '../mutationHooks/task/toggleTask';
import {useDeleteTask} from '../mutationHooks/task/deleteTask';

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
  const [deleteTask] = useDeleteTask();
  const navigation = useNavigation<TaskNavigationProp>();
  const [toggleTask] = useToggleTask();
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(task.done);
  }, [task]);

  const deleteTaskFunc = async () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    await deleteTask({
      id: task.id,
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
                  setDone(!done);
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut,
                  );
                  setTimeout(() => {
                    toggleTask({id: task.id});
                  }, 400);
                }}>
                <Image
                  source={
                    done
                      ? require('../../assets/Checkmark.png')
                      : require('../../assets/Circle.png')
                  }
                  style={styles.checkMark}
                />
              </TouchableOpacity>
              <View style={{flex: 1}}>
                <BasicText>{task.name}</BasicText>
                {task.subject?.name && (
                  <BasicText textVariant="subText" color="textSecondary">
                    {task.subject?.name}
                  </BasicText>
                )}
              </View>
              {task.dueDate && (
                <BasicText textVariant="subText" color="textSecondary">
                  {dayjs(task.dueDate).calendar(
                    null,
                    calendarConfigWithoutTime,
                  )}
                </BasicText>
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
  subject: {
    color: 'grey',
  },
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
