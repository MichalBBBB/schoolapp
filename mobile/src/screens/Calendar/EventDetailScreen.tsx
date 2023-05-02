import {NativeStackScreenProps} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import BackButton from '../../components/backButton';
import {BasicButton} from '../../components/basicViews/BasicButton';
import {BasicText} from '../../components/basicViews/BasicText';
import {BasicTextInput} from '../../components/basicViews/BasicTextInput';
import EditDateModal from '../../components/modals/editDateWindow';

import {
  RemindersInput,
  SubjectFragment,
  useGetAllEventsQuery,
} from '../../generated/graphql';

import {v4 as uuidv4} from 'uuid';
import {setRemindersFromApollo} from '../../utils/reminderUtils';
import {useApolloClient} from '@apollo/client';
import {SelectSubjectPopup} from '../../components/popups/selectSubject/selectSubjectPopup';
import {useEditEvent} from '../../mutationHooks/calendarEvent/editEvent';
import {BasicCard} from '../../components/basicViews/BasicCard';
import {
  CalendarStackParamList,
  CalendarStackScreenProps,
} from '../../utils/types';
import {useCreateEvent} from '../../mutationHooks/calendarEvent/createEvent';
import {RemindersWindow} from '../../components/modals/remindersWindow';
import {checkPermissions} from '../../utils/notifications';

const EventDetailScreen: React.FC<
  CalendarStackScreenProps<'EventDetailScreen'>
> = ({navigation, route}) => {
  const {data: events} = useGetAllEventsQuery();
  const event = events?.getAllEvents.find(
    item => item.id == route.params.event?.id,
  );

  const isNew = !route.params.event;

  const [editEvent] = useEditEvent();

  const client = useApolloClient();

  const [createEvent] = useCreateEvent();

  const [startDate, setStartDate] = useState(
    dayjs(event?.startDate) || dayjs(),
  );
  const [endDate, setEndDate] = useState(
    dayjs(event?.endDate) || dayjs().add(1, 'hour'),
  );
  const [subject, setSubject] = useState<SubjectFragment | null>(
    event?.subject || null,
  );
  const [endDateHasBeenChanged, setEndDateHasBeenChanged] = useState(false);
  const [name, setName] = useState(event?.name || '');
  const [text, setText] = useState(event?.text || '');
  const [editStartDateModalIsVisible, setEditStartDateModalIsVisible] =
    useState(false);
  const [editEndDateModalIsVisible, setEditEndDateModalIsVisible] =
    useState(false);
  const [remindersWindowOpen, setRemindersWindowOpen] = useState(false);
  const [reminderTimes, setReminderTimes] = useState<number[] | undefined>(
    event?.reminders.map(item => item.minutesBefore) || [],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isNew ? 'New Event' : 'Edit Event',
      headerRight: () => (
        <BasicButton
          variant="unstyled"
          onPress={() => {
            let reminders: RemindersInput[] | undefined;
            if (reminderTimes) {
              reminders = reminderTimes.map(item => {
                console.log('date', dayjs(startDate).subtract(item, 'minute'));
                const id = uuidv4();
                return {
                  id,
                  title: name,
                  minutesBefore: item,
                  date: dayjs(startDate).subtract(item, 'minute').toDate(),
                };
              });
            }
            console.log(reminders);
            if (event) {
              editEvent({
                id: event.id,
                name,
                text,
                startDate: startDate,
                endDate: endDate,
                subjectId: subject?.id,
                wholeDay: event.wholeDay,
                reminders,
              });
            } else {
              createEvent({
                id: uuidv4(),
                startDate: startDate.toISOString(),
                name: name,
                endDate: endDate.toISOString(),
                subjectId: subject?.id,
                text,
                reminders,
              });
            }
            setRemindersFromApollo(client);
            navigation.goBack();
          }}>
          <BasicText textVariant="button">Save</BasicText>
        </BasicButton>
      ),
    });
  });

  return (
    <>
      <ScrollView
        style={styles.container}
        onScrollBeginDrag={() => {
          Keyboard.dismiss();
        }}>
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
          backgroundColor={'accentBackground1'}>
          <SelectSubjectPopup
            forceSide="right"
            onSubmit={subject => {
              setSubject(subject);
            }}
            trigger={
              <Pressable style={styles.listItem}>
                <BasicText>Subject</BasicText>
                <BasicText>{subject?.name || 'None'}</BasicText>
              </Pressable>
            }
          />
        </BasicCard>
        <BasicCard
          gap={5}
          marginBottom={10}
          backgroundColor="accentBackground1">
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
                  {dayjs(startDate).format('DD/MM/YYYY')}
                </BasicText>
                <BasicText>{dayjs(startDate).format('HH:mm')}</BasicText>
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
                  {dayjs(endDate).format('DD/MM/YYYY')}
                </BasicText>
                <BasicText>{dayjs(endDate).format('HH:mm')}</BasicText>
              </View>
            </BasicButton>
          </View>
        </BasicCard>
        <BasicCard
          spacing="m"
          marginBottom={10}
          backgroundColor={'accentBackground1'}>
          <Pressable
            style={styles.listItem}
            onPress={() => {
              setRemindersWindowOpen(true);
            }}>
            <BasicText>Reminder</BasicText>
            <BasicText>
              {event?.reminders.length
                ? `${event.reminders.length} selected`
                : 'None'}
            </BasicText>
          </Pressable>
        </BasicCard>
        <BasicCard backgroundColor="accentBackground1">
          <BasicTextInput
            value={text || ''}
            variant="unstyled"
            placeholder="Description"
            textAlignVertical="top"
            onChangeText={setText}
            marginBottom={10}
            style={{minHeight: 150}}
            multiline={true}
          />
        </BasicCard>
      </ScrollView>
      <EditDateModal
        clearButton={false}
        initialDate={startDate ? dayjs(startDate) : dayjs()}
        subject={subject}
        onClose={() => {
          setEditStartDateModalIsVisible(false);
        }}
        onSubmit={date => {
          setStartDate(date!);
          if (isNew) {
            if (!endDateHasBeenChanged) {
              setEndDate(date!.add(1, 'hour'));
            }
          }
          setEditStartDateModalIsVisible(false);
        }}
        isVisible={editStartDateModalIsVisible}
      />
      <EditDateModal
        clearButton={false}
        initialDate={endDate ? dayjs(endDate) : dayjs()}
        onClose={() => {
          setEditEndDateModalIsVisible(false);
        }}
        onSubmit={date => {
          setEditEndDateModalIsVisible(false);
          if (!endDate.isSame(date)) {
            setEndDateHasBeenChanged(true);
          }
          setEndDate(date!);
        }}
        isVisible={editEndDateModalIsVisible}
      />
      <RemindersWindow
        initialReminderTimes={reminderTimes}
        isVisible={remindersWindowOpen}
        onClose={() => setRemindersWindowOpen(false)}
        onSubmit={value => {
          checkPermissions();
          setReminderTimes(value);
          setRemindersWindowOpen(false);
        }}
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
