import {NativeStackScreenProps} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  Touchable,
  View,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import Calendar from '../components/calendar';
import {CalendarStackParamList} from '../routes/CalendarStack';
import {Picker, PickerIOS} from '@react-native-picker/picker';
import {
  GetAllEventsDocument,
  useCreateEventMutation,
} from '../generated/graphql';

const calendarWidth = Dimensions.get('screen').width - 40;
const weekHeight = 34;
const calendarPastScrollRange = 5;
const calendarFutureScrollRange = 20;

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
  const [selectedDay, setSelectedDay] = useState(dayjs());
  const [selectedHour, setSelectedHour] = useState(dayjs().hour());
  const [selectedMinute, setSelectedMinute] = useState(dayjs().minute());
  const [createEvent] = useCreateEventMutation();
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.nameInput}
        placeholder="Name"
        onChangeText={setName}
      />
      <Text style={styles.text}>Select Date</Text>
      <Calendar
        calendarWidth={calendarWidth}
        selectedDay={selectedDay}
        onChangeSelectedDay={setSelectedDay}
        pastScrollRange={calendarPastScrollRange}
        futureScrollRange={calendarFutureScrollRange}
        weekHeight={weekHeight}
      />
      <View style={styles.timeContainer}>
        <PickerIOS
          itemStyle={{fontSize: 15, width: 100}}
          selectedValue={selectedHour}
          onValueChange={value => {
            setSelectedHour(value as number);
          }}>
          {hours.map(item => (
            <Picker.Item label={item.toString()} value={item} />
          ))}
        </PickerIOS>
        <Text>:</Text>
        <PickerIOS
          itemStyle={{fontSize: 15, width: 100}}
          selectedValue={selectedMinute}
          onValueChange={value => setSelectedMinute(value as number)}>
          {minutes.map(item => (
            <Picker.Item label={item.toString()} value={item} />
          ))}
        </PickerIOS>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.button}
          onPress={() => {
            const startDate = selectedDay
              .hour(selectedHour)
              .minute(selectedMinute);
            createEvent({
              variables: {startDate: startDate.toISOString(), name: name},
              refetchQueries: [GetAllEventsDocument],
            });
            navigation.goBack();
          }}>
          <Text>Submit</Text>
        </Pressable>
      </View>
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
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
});

export default AddEventScreen;
