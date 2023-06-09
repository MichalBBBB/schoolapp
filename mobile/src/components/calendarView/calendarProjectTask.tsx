import dayjs from 'dayjs';
import React, {useState} from 'react';
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
import {useDeleteProjectTask} from '../../mutationHooks/projectTask/deleteProjectTask';

interface CalendarProjectTaskProps {
  task: TaskFragment;
  height?: number;
}

const CalendarProjectTask: React.FC<CalendarProjectTaskProps> = ({
  task,
  height,
}) => {
  const [deleteProjectTask] = useDeleteProjectTask();

  const navigation = useNavigation<CalendarNavigationProp>();

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
          padding: 12,
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <BasicText>{task.name}</BasicText>
        </View>
        <BasicText color="textSecondary" style={{marginRight: 8}}>
          {`${dayjs(task.doDate).format('HH:mm')} - ${dayjs(task.doDate)
            .add(task.duration, 'm')
            .format('HH:mm')}`}
        </BasicText>
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
                deleteProjectTask({id: task.id});
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

export default CalendarProjectTask;
