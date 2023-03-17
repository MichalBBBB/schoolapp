import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import React, {memo, useEffect, useState} from 'react';
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
import {
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {useToggleTask} from '../mutationHooks/task/toggleTask';
import {useDeleteTask} from '../mutationHooks/task/deleteTask';
import {useTheme} from '../contexts/ThemeContext';
import {ColorsObject, SubjectColorsObject} from '../types/Theme';
import {useEditTask} from '../mutationHooks/task/editTask';
import {BasicIcon} from './basicViews/BasicIcon';

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
  backgroundColor?: keyof ColorsObject;
  planning?: Boolean;
  planningDay?: dayjs.Dayjs;
}> = ({
  task,
  backgroundColor = 'background',
  planning = false,
  planningDay = dayjs(),
}) => {
  const [deleteTask] = useDeleteTask();
  const navigation = useNavigation<TaskNavigationProp>();
  const [toggleTask] = useToggleTask();
  const [editTask] = useEditTask();
  const [done, setDone] = useState(false);
  const [theme] = useTheme();

  useEffect(() => {
    setDone(task.done);
  }, [task]);

  const deleteTaskFunc = async () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    await deleteTask({
      id: task.id,
    });
  };

  // only when planning tasks
  const isTaskSelected = () => {
    if (task.doDate) {
      return dayjs(task.doDate).isSame(planningDay, 'day');
    } else {
      return false;
    }
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
    <View style={{overflow: 'hidden'}}>
      <SlidingView
        frontView={
          <TouchableHighlight
            onPress={() => {
              navigation.navigate('TaskDetailScreen', {task: task});
            }}>
            <View
              style={[
                styles.container,
                {backgroundColor: theme.colors[backgroundColor]},
              ]}>
              <TouchableOpacity
                onPress={() => {
                  if (planning) {
                    LayoutAnimation.configureNext(
                      LayoutAnimation.Presets.easeInEaseOut,
                    );
                    editTask({
                      id: task.id,
                      name: task.name,
                      text: task.text,
                      dueDate: task.dueDate,
                      doDate: task.doDate ? null : planningDay.toDate(),
                      subjectId: task.subject?.id,
                    });
                  } else {
                    setDone(!done);
                    LayoutAnimation.configureNext(
                      LayoutAnimation.Presets.easeInEaseOut,
                    );
                    setTimeout(() => {
                      toggleTask({id: task.id});
                    }, 400);
                  }
                }}>
                {planning ? (
                  <BasicIcon
                    source={
                      isTaskSelected()
                        ? require('../../assets/Chevron-down.png')
                        : require('../../assets/Chevron-up.png')
                    }
                    style={styles.arrow}
                  />
                ) : (
                  <BasicIcon
                    source={
                      done
                        ? require('../../assets/Checkmark.png')
                        : require('../../assets/Circle.png')
                    }
                    style={styles.checkMark}
                  />
                )}
              </TouchableOpacity>
              <View style={{flex: 1}}>
                <BasicText>{task.name}</BasicText>
                {task.subject?.name && (
                  <View style={{alignItems: 'center', flexDirection: 'row'}}>
                    <View
                      style={{
                        marginRight: 5,
                        height: 10,
                        width: 10,
                        borderRadius: 5,
                        backgroundColor:
                          theme.subjectColors[
                            task.subject.colorName as keyof SubjectColorsObject
                          ].primary,
                      }}
                    />
                    <BasicText textVariant="subText" color="textSecondary">
                      {task.subject?.name}
                    </BasicText>
                  </View>
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
          </TouchableHighlight>
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
  arrow: {
    resizeMode: 'stretch',
    width: 20,
    height: 20,
    marginRight: 10,
  },
  container: {
    padding: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default memo(Task);
