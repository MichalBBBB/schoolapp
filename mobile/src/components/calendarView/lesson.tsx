import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Pressable,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';
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
import EditDateModal from '../modals/editDateWindow';
import {Menu} from '../menu';
import {MenuItem} from '../menu/MenuItem';
import {v4 as uuidv4} from 'uuid';
import {useCreateTask} from '../../mutationHooks/task/createTask';
import {SubjectColorsObject} from '../../types/Theme';
import {useDeleteEvent} from '../../mutationHooks/calendarEvent/deleteEvent';
import {Popup} from '../popup';
import {useNavigation} from '@react-navigation/native';
import {CalendarNavigationProp} from '../../utils/types';
import {BasicIcon} from '../basicViews/BasicIcon';
import {useTheme} from '../../contexts/ThemeContext';
import {LessonDetailView} from '../modals/lessonDetailView';
import {BasicButton} from '../basicViews/BasicButton';
import {version} from 'graphql';

interface LessonProps {
  lesson: LessonFragment;
  event?: CalendarEventFragment;
  height?: number;
  variant?: 'list' | 'calendar';
  onEventPress: (event: CalendarEventFragment) => void;
  navigation: CalendarNavigationProp;
}

export const Lesson: React.FC<LessonProps> = ({
  lesson,
  event,
  height,
  variant = 'list',
  onEventPress,
  navigation,
}) => {
  const [studyTimeModalVisible, setStudyTimeModalVisible] = useState(false);
  const [lessonDetailViewVisible, setLessonDetailViewVisible] = useState(false);
  const [addTask] = useCreateTask();
  const [deleteEvent] = useDeleteEvent();
  const [theme] = useTheme();

  const extraInfoView = (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <BasicText color="textSecondary">{lesson.subject.extraInfo}</BasicText>
      {lesson.extraInfo && lesson.subject.extraInfo && (
        <View
          style={{
            backgroundColor: theme.colors.textSecondary,
            height: 5,
            width: 5,
            borderRadius: 10,
            marginLeft: 5,
          }}
        />
      )}
      {lesson.extraInfo && (
        <BasicText style={{marginLeft: 5}} color={'textSecondary'}>
          {lesson.extraInfo}
        </BasicText>
      )}
    </View>
  );

  return (
    <>
      <BasicButton
        backgroundColor="background"
        onPress={() => {
          if (variant == 'calendar') {
            setLessonDetailViewVisible(true);
          }
        }}
        style={{height}}
        spacing="none"
        disabled={variant == 'list'}>
        <BasicCard
          subjectColor={lesson.subject.colorName as keyof SubjectColorsObject}
          borderWidth={1}
          style={[
            styles.container,
            {
              justifyContent: 'space-between',
              width: '100%',
              height: height ? '100%' : undefined,
            },
          ]}>
          <View>
            <View style={styles.horizontalContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View>
                  <BasicText style={{marginRight: 5}}>
                    {lesson.subject.name}
                  </BasicText>
                  {variant == 'calendar' && extraInfoView}
                </View>
                {variant == 'list' && extraInfoView}
              </View>
              {variant == 'list' && (
                <BasicText color="textSecondary">
                  {`${dayjs(lesson.lessonTime.startTime, 'HH:mm').format(
                    'HH:mm',
                  )} - ${dayjs(lesson.lessonTime.endTime, 'HH:mm').format(
                    'HH:mm',
                  )}`}
                </BasicText>
              )}
              {variant == 'calendar' && event && (
                <View
                  style={{
                    backgroundColor: theme.colors.accentBackground1,
                    borderRadius: 20,
                    width: 25,
                    height: 25,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <BasicText>1</BasicText>
                </View>
              )}
            </View>

            {variant == 'list' && event && (
              <TouchableWithoutFeedback
                onPress={() => {
                  onEventPress(event);
                }}>
                <BasicCard
                  style={[styles.eventContainer]}
                  backgroundColor="accentBackground1">
                  <BasicText>{event.name}</BasicText>
                  <Popup
                    trigger={
                      <Pressable>
                        <BasicIcon
                          source={require('../../../assets/Options.png')}
                          style={styles.options}
                        />
                      </Pressable>
                    }>
                    <Menu>
                      <MenuItem
                        text={'Add time to study'}
                        onPress={() => {
                          setStudyTimeModalVisible(true);
                        }}
                      />
                      <MenuItem
                        color="dangerous"
                        text={'Delete'}
                        onPress={() => {
                          deleteEvent({id: event.id});
                        }}
                      />
                    </Menu>
                  </Popup>
                </BasicCard>
              </TouchableWithoutFeedback>
            )}
          </View>
          {variant == 'calendar' && (
            <BasicText color="textSecondary">
              {`${dayjs(lesson.lessonTime.startTime, 'HH:mm').format(
                'HH:mm',
              )} - ${dayjs(lesson.lessonTime.endTime, 'HH:mm').format(
                'HH:mm',
              )}`}
            </BasicText>
          )}
        </BasicCard>
      </BasicButton>
      <LessonDetailView
        navigation={navigation}
        onClose={() => {
          setLessonDetailViewVisible(false);
        }}
        visible={lessonDetailViewVisible}
        lesson={lesson}
        event={event}
      />
      <EditDateModal
        clearButton={false}
        isVisible={studyTimeModalVisible}
        onClose={() => {
          setStudyTimeModalVisible(false);
        }}
        onSubmit={date => {
          setStudyTimeModalVisible(false);
          addTask({
            id: uuidv4(),
            name: `Study for ${event?.name}`,
            subjectId: lesson.subject.id,
            dueDate: event?.startDate,
            doDate: date!.toDate(),
          });
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
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
    alignItems: 'center',
  },
  eventContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  options: {
    resizeMode: 'stretch',
    height: 20,
    width: 20,
  },
});
