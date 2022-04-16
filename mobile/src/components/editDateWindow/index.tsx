import {PickerIOS, Picker} from '@react-native-picker/picker';
import dayjs, {Dayjs} from 'dayjs';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import BackgroundPress from '../backgroundPress';
import Calendar from '../calendar';
import WeekDays from '../calendar/weekDays';
import Popup from '../popup';

interface EditDateWindowProps {
  onSubmit: (date: dayjs.Dayjs) => void;
  initialDate?: dayjs.Dayjs | null;
}

type SpecialDate = {
  name: string;
  date: dayjs.Dayjs;
};

const specialDates: SpecialDate[][] = [
  [
    {name: 'Today', date: dayjs()},
    {name: 'Tommorow', date: dayjs().add(1, 'day')},
  ],
  [
    {name: 'Next week', date: dayjs().add(1, 'week')},
    {name: 'otherOption', date: dayjs()},
  ],
];

const windowWidth = Dimensions.get('screen').width - 30;
const weekHeight = 34;
const calendarHeight = 34 * 6;

let hours: string[] = [];
for (var i = 0; i < 24; i++) {
  let number = i;
  if (number.toString().length == 1) {
    hours.push('0' + i.toString());
  } else {
    hours.push(i.toString());
  }
}

let minutes: string[] = [];
for (var i = 0; i < 60; i++) {
  let number = i;
  if (number.toString().length == 1) {
    minutes.push('0' + i.toString());
  } else {
    minutes.push(i.toString());
  }
}

const EditDateWindow: React.FC<EditDateWindowProps> = ({
  onSubmit,
  initialDate,
}) => {
  const [selectedDay, setSelectedDay] = useState<dayjs.Dayjs>(
    initialDate || dayjs(),
  );
  const [selectedSpecialDay, setSelectedSpecialDay] =
    useState<SpecialDate | null>(null);
  const [height, setHeight] = useState(0);
  const [specialDays, setSpecialDays] = useState<SpecialDate[][]>(specialDates);
  const findDimensions = ({height}: {height: number}) => {
    setHeight(height);
  };
  const [timePopupOpen, setTimePopupOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState(selectedDay.format('HH'));
  const [selectedMinute, setSelectedMinute] = useState(
    selectedDay.format('mm'),
  );

  const selectTimeView = (
    <View style={styles.timeContainer}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <PickerIOS
          itemStyle={{fontSize: 15, width: 100}}
          selectedValue={selectedHour}
          onValueChange={value => {
            setSelectedHour(value as string);
          }}>
          {hours.map(item => (
            <Picker.Item label={item} value={item} />
          ))}
        </PickerIOS>
        <Text>:</Text>
        <PickerIOS
          itemStyle={{fontSize: 15, width: 100}}
          selectedValue={selectedMinute}
          onValueChange={value => setSelectedMinute(value as string)}>
          {minutes.map(item => (
            <Picker.Item label={item} value={item} />
          ))}
        </PickerIOS>
      </View>
      <Pressable
        style={{padding: 10}}
        onPress={() => {
          console.log(
            'select time',
            parseInt(selectedHour),
            parseInt(selectedMinute),
          );
          const newDate = selectedDay
            .hour(parseInt(selectedHour))
            .minute(parseInt(selectedMinute));
          console.log(newDate);
          setSelectedDay(newDate);
          setTimePopupOpen(false);
        }}>
        <Text>Select</Text>
      </Pressable>
    </View>
  );

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        width: windowWidth,
        position: 'absolute',
        alignSelf: 'center',
        paddingVertical: 15,
        top: '50%',
        marginTop: -(height / 2),
      }}
      onLayout={event => {
        findDimensions(event.nativeEvent.layout);
      }}>
      {specialDays.map((item, index) => (
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
          }}>
          {item.map((day, index) => (
            <View
              style={{
                width: windowWidth / 2,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor:
                      selectedSpecialDay == day ? '#ddd' : undefined,
                  },
                ]}
                onPress={() => {
                  setSelectedSpecialDay(day);
                  setSelectedDay(
                    day.date
                      .hour(selectedDay.hour())
                      .minute(selectedDay.minute()),
                  );
                }}>
                <Text>{day.name}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ))}
      <WeekDays weekHeaderHeight={30} width={windowWidth - 20} />
      <View style={{height: calendarHeight}}>
        <Calendar
          weekHeight={weekHeight}
          calendarWidth={windowWidth - 20}
          pastScrollRange={2}
          futureScrollRange={20}
          selectedDay={'get' in selectedDay ? selectedDay : null}
          onChangeSelectedDay={date => {
            setSelectedDay(
              date.hour(selectedDay.hour()).minute(selectedDay.minute()),
            );
            setSelectedSpecialDay(null);
          }}
        />
      </View>
      <Pressable
        onPress={() => setTimePopupOpen(true)}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          padding: 10,
          paddingHorizontal: 40,
        }}>
        <Text>Time</Text>
        <Text>{selectedDay.format('HH:mm')}</Text>
      </Pressable>
      <TouchableOpacity
        onPress={() => {
          const date: dayjs.Dayjs = selectedDay;
          onSubmit(date);
        }}>
        <Text>Submit</Text>
      </TouchableOpacity>
      <Popup
        onClose={() => setTimePopupOpen(false)}
        width={windowWidth}
        open={timePopupOpen}>
        {selectTimeView}
      </Popup>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#666',
    marginLeft: 10,
    marginTop: 20,
  },
  timeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 15,
  },
});

export default EditDateWindow;
