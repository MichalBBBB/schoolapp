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
import {BasicCard} from '../basicViews/BasicCard';
import {BasicText} from '../basicViews/BasicText';
import EditDateModal from '../editDateWindow';
import {Menu} from '../menu';
import {MenuItem} from '../menu/MenuItem';
import {v4 as uuidv4} from 'uuid';

interface LessonProps {
  lesson: LessonFragment;
  event?: CalendarEventFragment;
}

export const Lesson: React.FC<LessonProps> = ({lesson, event}) => {
  const [studyTimeModalVisible, setStudyTimeModalVisible] = useState(false);
  const [addTask] = useCreateTaskMutation();
  return (
    <>
      <BasicCard backgroundColor="accentBackground" style={styles.container}>
        <View style={styles.horizontalContainer}>
          <BasicText>{lesson.subject.name}</BasicText>
          <BasicText color="textSecondary">
            {dayjs(lesson.lessonTime.startTime, 'HH:mm').format('HH:mm')}
          </BasicText>
        </View>
        {event && (
          <View style={styles.eventContainer}>
            <BasicText>{event.name}</BasicText>
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
      </BasicCard>
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
              id: uuidv4(),
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
