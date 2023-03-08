import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View, LayoutAnimation} from 'react-native';
import {
  ProjectTaskFragment,
  ProjectTaskWithProjectFragment,
  TaskFragment,
  useDeleteProjectTaskMutation,
  useDeleteTaskMutation,
  useToggleProjectTaskMutation,
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

dayjs.extend(calendar);

export const calendarConfigWithoutTime = {
  sameDay: '[Today]',
  nextDay: '[Tomorrow]',
  nextWeek: 'dddd',
  lastDay: '[Yesterday]',
  lastWeek: '[Last] dddd',
  sameElse: 'DD/MM/YYYY',
};

const TaskListProjectTask: React.FC<{
  projectTask: ProjectTaskWithProjectFragment;
  backgroundColor?: keyof ColorsObject;
}> = ({projectTask, backgroundColor = 'background'}) => {
  const [deleteProjectTask] = useDeleteProjectTaskMutation();
  const navigation = useNavigation<TaskNavigationProp>();
  const [toggleTask] = useToggleProjectTaskMutation();
  const [done, setDone] = useState(false);
  const [theme] = useTheme();

  useEffect(() => {
    setDone(projectTask.done);
  }, [projectTask]);

  const deleteTaskFunc = async () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    await deleteProjectTask({
      variables: {
        id: projectTask.id,
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
    <View style={{overflow: 'hidden'}}>
      <SlidingView
        frontView={
          <TouchableHighlight
            onPress={() => {
              // figure out
              // navigation.navigate('TaskDetailScreen', {task: task});
            }}>
            <View
              style={[
                styles.container,
                {backgroundColor: theme.colors[backgroundColor]},
              ]}>
              <TouchableOpacity
                onPress={() => {
                  setDone(!done);
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut,
                  );
                  setTimeout(() => {
                    toggleTask({variables: {id: projectTask.id}});
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
                <BasicText>{projectTask.name}</BasicText>

                <BasicText textVariant="subText" color="textSecondary">
                  {projectTask.project.name}
                </BasicText>
              </View>
              {projectTask.dueDate && (
                <BasicText textVariant="subText" color="textSecondary">
                  {dayjs(projectTask.dueDate).calendar(
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
  container: {
    padding: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default TaskListProjectTask;
