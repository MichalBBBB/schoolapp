import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  LayoutAnimation,
} from 'react-native';
import {
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {TaskFragment} from '../../generated/graphql';
import {useDeleteEvent} from '../../mutationHooks/calendarEvent/deleteEvent';
import {useCreateTask} from '../../mutationHooks/task/createTask';
import {BasicText} from '../basicViews/BasicText';
import EditDateModal from '../modals/editDateWindow';
import SlidingView from '../slidingView';
import {v4 as uuidv4} from 'uuid';
import {useNavigation} from '@react-navigation/native';
import {CalendarNavigationProp} from '../../utils/types';
import {BasicCard} from '../basicViews/BasicCard';
import {useTheme} from '../../contexts/ThemeContext';
import {BasicIcon} from '../basicViews/BasicIcon';
import {useDeleteTask} from '../../mutationHooks/task/deleteTask';

interface CalendarTaskProps {
  task: TaskFragment;
  height: number;
}

const CalendarTask: React.FC<CalendarTaskProps> = ({task, height}) => {
  const [deleteTask] = useDeleteTask();

  const navigation = useNavigation<CalendarNavigationProp>();

  useEffect(() => {
    console.log(task);
  });

  if (!task.doDate || !task.doDateIncludesTime || !task.duration) {
    return <View style={{height}}></View>;
  }

  const frontView = (
    <TouchableHighlight
      onPress={() => {
        navigation.navigate('TaskDetailScreen', {task});
      }}>
      <BasicCard
        backgroundColor="accentBackground1"
        borderRadius={0}
        style={{
          height,
          padding: height >= 40 ? 12 : 0,
          paddingLeft: 10,
          justifyContent: height >= 40 ? 'space-between' : 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <BasicText style={{marginRight: 5}}>{task.name}</BasicText>
          <BasicText color="textSecondary" style={{marginRight: 8}}>
            {`${dayjs(task.doDate).format('HH:mm')} - ${dayjs(task.doDate)
              .add(task.duration, 'm')
              .format('HH:mm')}`}
          </BasicText>
        </View>
      </BasicCard>
    </TouchableHighlight>
  );

  return (
    <>
      <View style={styles.container}>
        <SlidingView
          frontView={frontView}
          backView={[
            <TouchableOpacity
              onPress={() => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut,
                );
                deleteTask({id: task.id});
              }}>
              <View style={styles.backViewContainer}>
                <Image
                  source={require('../../../assets/Delete.png')}
                  style={styles.image}
                />
              </View>
            </TouchableOpacity>,
          ]}
          backViewWidth={70}
          numberOfBackElements={1}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'stretch',
    height: 25,
    width: 25,
    tintColor: 'white',
  },
  backViewContainer: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  frontViewContainer: {},
  options: {
    resizeMode: 'stretch',
    height: 20,
    width: 20,
  },
});

export default CalendarTask;
