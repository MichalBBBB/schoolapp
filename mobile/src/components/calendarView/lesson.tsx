import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {
  CalendarEventFragment,
  GetAllEventsDocument,
  GetAllTasksDocument,
  LessonFragment,
  useCreateTaskMutation,
  useDeleteEventMutation,
} from '../../generated/graphql';
import EditDateModal from '../editDateWindow/editDateModal';
import {Menu} from '../menu';
import {MenuItem} from '../menu/MenuItem';
import SlidingView from '../slidingView';

interface LessonProps {
  lesson: LessonFragment;
  event?: CalendarEventFragment;
}

export const Lesson: React.FC<LessonProps> = ({lesson, event}) => {
  const [studyTimeModalVisible, setStudyTimeModalVisible] = useState(false);
  const [addTask] = useCreateTaskMutation();
  return (
    <>
      <View style={styles.container}>
        <View style={styles.horizontalContainer}>
          <Text>{lesson.subject.name}</Text>
          <Text>
            {dayjs(lesson.lessonTime.startTime, 'HH:mm').format('HH:mm')}
          </Text>
        </View>
        {event && (
          <View style={styles.eventContainer}>
            <Text>{event.name}</Text>
            <Menu
              trigger={
                <Image
                  source={require('../../../assets/Options.png')}
                  style={styles.options}
                />
              }>
              <MenuItem
                text={'Add time to study'}
                onPress={() => {
                  setStudyTimeModalVisible(true);
                }}
              />
            </Menu>
          </View>
        )}
      </View>
      <EditDateModal
        isVisible={studyTimeModalVisible}
        onClose={() => {
          setStudyTimeModalVisible(false);
        }}
        onSubmit={date => {
          setStudyTimeModalVisible(false);
          addTask({
            refetchQueries: [GetAllTasksDocument],
            variables: {
              name: `Study for ${event?.name}`,
              subjectId: lesson.subject.id,
              dueDate: event?.startDate,
              doDate: date.toDate(),
            },
          });
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#eee',
    padding: 10,
  },
  image: {
    resizeMode: 'stretch',
    height: 25,
    width: 25,
  },
  backViewContainer: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  horizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 10,
    marginTop: 10,
  },
  options: {
    resizeMode: 'stretch',
    height: 15,
    width: 15,
  },
});
