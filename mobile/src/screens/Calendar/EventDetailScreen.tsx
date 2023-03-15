import {NativeStackScreenProps} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import BackButton from '../../components/backButton';
import {BasicButton} from '../../components/basicViews/BasicButton';
import {BasicText} from '../../components/basicViews/BasicText';
import {BasicTextInput} from '../../components/basicViews/BasicTextInput';
import EditDateModal from '../../components/editDateWindow';

import {RemindersInput, useGetAllEventsQuery} from '../../generated/graphql';

import {v4 as uuidv4} from 'uuid';
import {setRemindersFromApollo} from '../../utils/reminderUtils';
import {useApolloClient} from '@apollo/client';
import {SelectSubjectPopup} from '../../components/selectSubject/selectSubjectPopup';
import {CalendarStackParamList} from '../../routes/CalendarStack';
import {useEditEvent} from '../../mutationHooks/calendarEvent/editEvent';
import {BasicCard} from '../../components/basicViews/BasicCard';

const EventDetailScreen: React.FC<
  NativeStackScreenProps<CalendarStackParamList, 'EventDetailScreen'>
> = ({navigation, route}) => {
  const {data: events} = useGetAllEventsQuery();
  const event = events?.getAllEvents.find(
    item => item.id == route.params.event.id,
  )!;

  const [editEvent] = useEditEvent();

  const client = useApolloClient();

  const [name, setName] = useState(event.name);
  const [text, setText] = useState(event.text);
  const [editStartDateModalIsVisible, setEditStartDateModalIsVisible] =
    useState(false);
  const [editEndDateModalIsVisible, setEditEndDateModalIsVisible] =
    useState(false);
  const [selectSubjectModalIsVisible, setSelectSubjectModalIsVisible] =
    useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <BasicButton
          variant="unstyled"
          onPress={() => {
            editEvent({
              id: event.id,
              name,
              text,
              startDate: event.startDate,
              endDate: event.endDate,
              subjectId: event.subject?.id,
              wholeDay: event.wholeDay,
            });
            navigation.goBack();
          }}>
          <BasicText>Save</BasicText>
        </BasicButton>
      ),
    });
  });

  return (
    <>
      <View style={styles.container}>
        <BasicTextInput
          value={name}
          spacing="m"
          placeholder="Name"
          onChangeText={setName}
          marginBottom={10}
        />

        <BasicCard
          spacing="m"
          marginBottom={10}
          backgroundColor={'accentBackground'}>
          <SelectSubjectPopup
            forceSide="right"
            onSubmit={subject => {
              editEvent({
                id: event.id,
                name,
                text,
                startDate: event.startDate,
                endDate: event.endDate,
                subjectId: subject?.id,
                wholeDay: event.wholeDay,
              });
            }}
            trigger={
              <Pressable style={styles.listItem}>
                <BasicText>Subject</BasicText>
                <BasicText>
                  {event.subject ? event.subject.name : 'None'}
                </BasicText>
              </Pressable>
            }
          />
        </BasicCard>
        <BasicCard gap={5} marginBottom={10} backgroundColor="accentBackground">
          <View style={styles.dateListItem}>
            <BasicText style={{marginLeft: 4}}>Start</BasicText>
            <BasicButton
              onPress={() => {
                setEditStartDateModalIsVisible(true);
              }}
              backgroundColor="lightBorder"
              borderWidth={1}
              variant="outlined"
              spacing="s"
              borderRadius={10}>
              <View style={styles.dateAndTimeContainer}>
                <BasicText style={{marginRight: 5}}>
                  {dayjs(event.startDate).format('DD/MM/YYYY')}
                </BasicText>
                <BasicText>{dayjs(event.startDate).format('HH:mm')}</BasicText>
              </View>
            </BasicButton>
          </View>
          <View style={styles.dateListItem}>
            <BasicText style={{marginLeft: 4}}>End</BasicText>
            <BasicButton
              onPress={() => {
                setEditEndDateModalIsVisible(true);
              }}
              backgroundColor="lightBorder"
              borderWidth={1}
              variant="outlined"
              spacing="s"
              borderRadius={10}>
              <View style={styles.dateAndTimeContainer}>
                <BasicText style={{marginRight: 5}}>
                  {dayjs(event.endDate).format('DD/MM/YYYY')}
                </BasicText>
                <BasicText>{dayjs(event.endDate).format('HH:mm')}</BasicText>
              </View>
            </BasicButton>
          </View>
        </BasicCard>
        <BasicCard backgroundColor="accentBackground">
          <BasicTextInput
            value={text || ''}
            variant="unstyled"
            placeholder="Description"
            onChangeText={setText}
            marginBottom={10}
            style={{minHeight: 150}}
            multiline={true}
          />
        </BasicCard>
      </View>
      <EditDateModal
        initialDate={event.startDate ? dayjs(event.startDate) : dayjs()}
        subject={event.subject}
        onClose={() => {
          setEditStartDateModalIsVisible(false);
        }}
        onSubmit={date => {
          editEvent({
            id: event.id,
            name,
            text,
            startDate: date.toDate(),
            endDate: event.endDate,
            subjectId: event.subject?.id,
            wholeDay: event.wholeDay,
          });
          setEditStartDateModalIsVisible(false);
        }}
        isVisible={editStartDateModalIsVisible}
      />
      <EditDateModal
        initialDate={event.endDate ? dayjs(event.endDate) : dayjs()}
        // initialReminderTimes={task.reminders.map(item => item.minutesBefore)}
        // reminders
        onClose={() => {
          setEditEndDateModalIsVisible(false);
        }}
        onSubmit={async (date, reminderTimes) => {
          let reminders: RemindersInput[] | undefined;
          if (reminderTimes) {
            reminders = reminderTimes.map(item => {
              console.log('date', dayjs(date).subtract(item, 'minute'));
              const id = uuidv4();
              return {
                id,
                title: event.name,
                minutesBefore: item,
                date: dayjs(date).subtract(item, 'minute').toDate(),
              };
            });
          }
          setEditEndDateModalIsVisible(false);
          editEvent({
            id: event.id,
            name,
            text,
            startDate: event.startDate,
            endDate: date.toDate(),
            subjectId: event.subject?.id,
            wholeDay: event.wholeDay,
          });
          setRemindersFromApollo(client);
        }}
        isVisible={editEndDateModalIsVisible}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  dateTimeButton: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    borderColor: '#aaa',
  },
  dateListItem: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  dateAndTimeContainer: {
    flexDirection: 'row',
  },
  dateAndTime: {},
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default EventDetailScreen;
