import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, View, LayoutAnimation} from 'react-native';
import {
  GetProjectsDocument,
  GetProjectTasksOfUserDocument,
  ProjectTaskWithProjectFragment,
  useDeleteProjectTaskMutation,
  useToggleProjectTaskMutation,
} from '../../generated/graphql';
import SlidingView from '../slidingView';
import calendar from 'dayjs/plugin/calendar';
import {BasicText} from '../basicViews/BasicText';
import {
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {useTheme} from '../../contexts/ThemeContext';
import {ColorsObject} from '../../types/Theme';
import {BasicIcon} from '../basicViews/BasicIcon';

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
  onPress: () => void;
}> = ({projectTask, backgroundColor = 'background', onPress}) => {
  const [deleteProjectTask] = useDeleteProjectTaskMutation();
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
      refetchQueries: [GetProjectTasksOfUserDocument, GetProjectsDocument],
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
          source={require('../../../assets/Delete.png')}
          style={{
            resizeMode: 'stretch',
            height: 25,
            width: 25,
            tintColor: 'white',
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
              onPress?.();
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
                <BasicIcon
                  source={
                    done
                      ? require('../../../assets/Checkmark.png')
                      : require('../../../assets/Circle.png')
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
