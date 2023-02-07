import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
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
import {SecondaryText} from './basicViews/SecondaryText';
import {PrimaryText} from './basicViews/PrimaryText';

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
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(task.done);
  }, [task]);

  const deleteTaskFunc = async () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    await deleteTask({
      variables: {id: task.id},
      update: cache => {
        const normalizedId = cache.identify({
          id: task.id,
          __typename: 'Task',
        });
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
                  setDone(!done);
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut,
                  );
                  setTimeout(() => {
                    toggleTask({variables: {id: task.id}});
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
                <PrimaryText>{task.name}</PrimaryText>
                {task.subject?.name && (
                  <SecondaryText>{task.subject?.name}</SecondaryText>
                )}
              </View>
              {task.dueDate && (
                <SecondaryText>
                  {dayjs(task.dueDate).calendar(
                    null,
                    calendarConfigWithoutTime,
                  )}
                </SecondaryText>
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
