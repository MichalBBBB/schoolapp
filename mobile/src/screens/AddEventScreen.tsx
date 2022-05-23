import {NativeStackScreenProps} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {CalendarStackParamList} from '../routes/CalendarStack';
import {
  GetAllEventsDocument,
  Subject,
  useCreateEventMutation,
} from '../generated/graphql';
import ConnectedList from '../components/connectedList';
import EditDateModal from '../components/editDateWindow/editDateModal';
import {BasicButton} from '../components/basicViews/BasicButton';
import {PrimaryText} from '../components/basicViews/PrimaryText';
import SelectSubjectModal from '../components/selectSubject';

let hours: number[] = [];
for (var i = 0; i < 24; i++) {
  hours.push(i);
}

let minutes: number[] = [];
for (var i = 0; i < 60; i++) {
  minutes.push(i);
}

console.log(dayjs().hour());

const AddEventScreen: React.FC<
  NativeStackScreenProps<CalendarStackParamList, 'AddEventScreen'>
> = ({navigation}) => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs().add(1, 'hour'));
  const [startDateModalVisible, setStartDateModalVisible] = useState(false);
  const [endDateModalVisible, setEndDateModalVisible] = useState(false);
  const [subjectModalVisible, setSubjectModalVisible] = useState(false);
  const [createEvent] = useCreateEventMutation();
  const [subject, setSubject] = useState<Subject | null>(null);

  return (
    <View style={styles.container}>
      <ConnectedList bottomMargin={10}>
        <TextInput
          style={styles.nameInput}
          placeholder="Name"
          onChangeText={setName}
        />
      </ConnectedList>
      <ConnectedList bottomMargin={10}>
        <Pressable
          style={styles.dateListItem}
          onPress={() => {
            setStartDateModalVisible(true);
          }}>
          <PrimaryText>Start</PrimaryText>
          <View style={styles.dateAndTimeContainer}>
            <Text style={{marginRight: 5}}>
              {startDate.format('DD/MM/YYYY')}
            </Text>
            <Text>{startDate.format('HH:mm')}</Text>
          </View>
        </Pressable>
        <Pressable
          style={styles.dateListItem}
          onPress={() => {
            setEndDateModalVisible(true);
          }}>
          <PrimaryText>End</PrimaryText>
          <View style={styles.dateAndTimeContainer}>
            <Text style={{marginRight: 5}}>{endDate.format('DD/MM/YYYY')}</Text>
            <Text>{endDate.format('HH:mm')}</Text>
          </View>
        </Pressable>
      </ConnectedList>
      <ConnectedList bottomMargin={10}>
        <Pressable
          style={styles.listItem}
          onPress={() => {
            setSubjectModalVisible(true);
          }}>
          <PrimaryText>Subject</PrimaryText>
          <PrimaryText>{subject ? subject.name : 'None'}</PrimaryText>
        </Pressable>
      </ConnectedList>
      <View style={styles.buttonContainer}>
        <BasicButton
          style={styles.button}
          onPress={() => {
            createEvent({
              variables: {
                startDate: startDate.toISOString(),
                name: name,
                endDate: endDate.toISOString(),
              },
              refetchQueries: [GetAllEventsDocument],
            });
            navigation.goBack();
          }}>
          <Text>Submit</Text>
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
        }}
      />
      <EditDateModal
        isVisible={endDateModalVisible}
        initialDate={endDate}
        onClose={() => {
          setEndDateModalVisible(false);
        }}
        onSubmit={date => {
          setEndDateModalVisible(false);
          setEndDate(date);
        }}
      />
      <SelectSubjectModal
        isVisible={subjectModalVisible}
        onClose={() => {
          setSubjectModalVisible(false);
        }}
        onSubmit={subject => {
          setSubject(subject);
          setSubjectModalVisible(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  nameInput: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 10,
  },
  container: {
    padding: 20,
  },
  text: {
    color: '#666',
    marginLeft: 10,
    marginTop: 20,
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
  button: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#eee',
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
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dateAndTimeContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    borderColor: '#aaa',
  },
  dateAndTime: {},
  listItem: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default AddEventScreen;
