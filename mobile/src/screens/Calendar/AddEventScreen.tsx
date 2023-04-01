import {NativeStackScreenProps} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import React, {useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  Keyboard,
} from 'react-native';
import {
  GetAllEventsDocument,
  Subject,
  SubjectFragment,
  useCreateEventMutation,
} from '../../generated/graphql';
import EditDateModal from '../../components/editDateWindow';
import {BasicButton} from '../../components/basicViews/BasicButton';
import SelectSubjectWindow from '../../components/selectSubject';
import {BasicText} from '../../components/basicViews/BasicText';
import {BasicTextInput} from '../../components/basicViews/BasicTextInput';
import {BasicCard} from '../../components/basicViews/BasicCard';
import {v4 as uuidv4} from 'uuid';
import {useCreateEvent} from '../../mutationHooks/calendarEvent/createEvent';
import {Popup} from '../../components/popup';
import {SelectSubjectPopup} from '../../components/selectSubject/selectSubjectPopup';
import {CalendarStackScreenProps} from '../../utils/types';

let hours: number[] = [];
for (var i = 0; i < 24; i++) {
  hours.push(i);
}

let minutes: number[] = [];
for (var i = 0; i < 60; i++) {
  minutes.push(i);
}

console.log(dayjs().hour());

const AddEventScreen: React.FC<CalendarStackScreenProps<'AddEventScreen'>> = ({
  navigation,
}) => {
  const [createEvent] = useCreateEvent();

  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs().add(1, 'hour'));
  const [endDateHasBeenChanged, setEndDateHasBeenChanged] = useState(false);
  const [startDateModalVisible, setStartDateModalVisible] = useState(false);
  const [endDateModalVisible, setEndDateModalVisible] = useState(false);
  const [subject, setSubject] = useState<SubjectFragment | null>(null);
  const [text, setText] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <BasicTextInput
        spacing="m"
        placeholder="Name"
        onChangeText={setName}
        marginBottom={10}
        autoFocus={true}
      />
      <BasicCard
        spacing="m"
        marginBottom={10}
        backgroundColor={'accentBackground1'}>
        <SelectSubjectPopup
          extraOnPress={() => {
            Keyboard.dismiss();
          }}
          forceSide="right"
          onSubmit={subject => {
            setSubject(subject);
          }}
          trigger={
            <Pressable style={styles.listItem}>
              <BasicText>Subject</BasicText>
              <BasicText>{subject ? subject.name : 'None'}</BasicText>
            </Pressable>
          }
        />
      </BasicCard>
      <BasicCard gap={5} marginBottom={10} backgroundColor="accentBackground1">
        <View style={styles.dateListItem}>
          <BasicText style={{marginLeft: 4}}>Start</BasicText>
          <BasicButton
            onPress={() => {
              setStartDateModalVisible(true);
              Keyboard.dismiss();
            }}
            backgroundColor="lightBorder"
            borderWidth={1}
            variant="outlined"
            spacing="s"
            borderRadius={10}>
            <View style={styles.dateAndTimeContainer}>
              <BasicText style={{marginRight: 5}}>
                {startDate.format('DD/MM/YYYY')}
              </BasicText>
              <BasicText>{startDate.format('HH:mm')}</BasicText>
            </View>
          </BasicButton>
        </View>
        <View style={styles.dateListItem}>
          <BasicText style={{marginLeft: 4}}>End</BasicText>
          <BasicButton
            onPress={() => {
              setEndDateModalVisible(true);
              Keyboard.dismiss();
            }}
            backgroundColor="lightBorder"
            borderWidth={1}
            variant="outlined"
            spacing="s"
            borderRadius={10}>
            <View style={styles.dateAndTimeContainer}>
              <BasicText style={{marginRight: 5}}>
                {endDate.format('DD/MM/YYYY')}
              </BasicText>
              <BasicText>{endDate.format('HH:mm')}</BasicText>
            </View>
          </BasicButton>
        </View>
      </BasicCard>

      <BasicCard backgroundColor="accentBackground1" marginBottom={10}>
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

      <View style={styles.buttonContainer}>
        <BasicButton
          spacing="m"
          onPress={() => {
            createEvent({
              id: uuidv4(),
              startDate: startDate.toISOString(),
              name: name,
              endDate: endDate.toISOString(),
              subjectId: subject?.id,
              text,
            });
            navigation.goBack();
          }}>
          <BasicText color="textContrast" textVariant="button">
            Submit
          </BasicText>
        </BasicButton>
      </View>
      <EditDateModal
        isVisible={startDateModalVisible}
        initialDate={startDate}
        onClose={() => {
          setStartDateModalVisible(false);
        }}
        onSubmit={date => {
          setStartDateModalVisible(false);
          setStartDate(date);
          if (!endDateHasBeenChanged) {
            setEndDate(date.add(1, 'hour'));
          }
        }}
        subject={subject}
      />
      <EditDateModal
        isVisible={endDateModalVisible}
        initialDate={endDate}
        onClose={() => {
          setEndDateModalVisible(false);
        }}
        onSubmit={date => {
          setEndDateModalVisible(false);
          if (!endDate.isSame(date)) {
            setEndDateHasBeenChanged(true);
          }
          setEndDate(date);
        }}
      />
    </View>
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

export default AddEventScreen;
