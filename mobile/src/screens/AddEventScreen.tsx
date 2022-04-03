import {NativeStackScreenProps} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  Touchable,
  View,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {CalendarStackParamList} from '../routes/CalendarStack';
import {
  GetAllEventsDocument,
  useCreateEventMutation,
} from '../generated/graphql';
import ConnectedList from '../components/connectedList';
import EditDateWindow from '../components/editDateWindow';

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
  const [createEvent] = useCreateEventMutation();

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
          <Text>Start</Text>
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
          <Text>End</Text>
          <View style={styles.dateAndTimeContainer}>
            <Text style={{marginRight: 5}}>{endDate.format('DD/MM/YYYY')}</Text>
            <Text>{endDate.format('HH:mm')}</Text>
          </View>
        </Pressable>
      </ConnectedList>
      <View style={styles.buttonContainer}>
        <Pressable
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
        </Pressable>
      </View>
      <Modal visible={startDateModalVisible} transparent={true}>
        <EditDateWindow
          initialDate={startDate}
          onClose={() => {
            setStartDateModalVisible(false);
          }}
          onSubmit={date => {
            setStartDateModalVisible(false);
            setStartDate(date);
          }}
        />
      </Modal>
      <Modal visible={endDateModalVisible} transparent={true}>
        <EditDateWindow
          initialDate={endDate}
          onClose={() => {
            setEndDateModalVisible(false);
          }}
          onSubmit={date => {
            setEndDateModalVisible(false);
            setEndDate(date);
          }}
        />
      </Modal>
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
});

export default AddEventScreen;
