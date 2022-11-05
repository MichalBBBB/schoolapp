import dayjs from 'dayjs';
import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {
  CalendarEventFragment,
  GetAllEventsDocument,
  LessonFragment,
  useDeleteEventMutation,
} from '../../generated/graphql';
import SlidingView from '../slidingView';

interface LessonProps {
  lesson: LessonFragment;
  event?: CalendarEventFragment;
}

export const Lesson: React.FC<LessonProps> = ({lesson, event}) => {
  return (
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
        </View>
      )}
    </View>
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
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 10,
    marginTop: 10,
  },
});
