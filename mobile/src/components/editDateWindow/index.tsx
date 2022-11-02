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
import {SubjectFragment, useGetAllLessonsQuery} from '../../generated/graphql';
import {closestLesson} from '../../utils/closestLesson';
import Calendar from '../calendar';
import WeekDays from '../calendar/weekDays';
import SelectTimeModal from '../selectTimeView/selectTimeModal';

interface EditDateWindowProps {
  onSubmit: (date: dayjs.Dayjs) => void;
  initialDate?: dayjs.Dayjs | null;
  subject?: SubjectFragment | undefined | null;
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
  [{name: 'Next week', date: dayjs().add(1, 'week')}],
];

const windowWidth = Dimensions.get('screen').width - 30;
const weekHeight = 34;
const calendarHeight = 34 * 6;

const EditDateWindow: React.FC<EditDateWindowProps> = ({
  onSubmit,
  initialDate,
  subject,
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
  const {data: lessons} = useGetAllLessonsQuery();

  useEffect(() => {
    console.log(subject, specialDays);
    if (subject) {
      console.log(
        'closest lesson',
        closestLesson(lessons?.getAllLessons || [], subject),
      );
      setSpecialDays([
        specialDays[0],
        [
          specialDays[1][0],
          {
            name: `Next ${subject.name}`,
            date: dayjs(closestLesson(lessons?.getAllLessons || [], subject)),
          },
        ],
      ]);
    }
  }, [subject]);

  useEffect(() => {
    console.log(specialDays);
  });

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
          key={index}
          style={{
            flexDirection: 'row',
            width: '100%',
          }}>
          {item.map((day, index) => (
            <View
              key={index}
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
      {/* <Popup
        onClose={() => setTimePopupOpen(false)}
        width={windowWidth}
        open={timePopupOpen}>
        {selectTimeView}
      </Popup> */}
      <SelectTimeModal
        onClose={() => {
          setTimePopupOpen(false);
        }}
        onSubmit={time => {
          setSelectedDay(
            selectedDay
              .hour(parseInt(time.split(':')[0]))
              .minute(parseInt(time.split(':')[1])),
          );
        }}
        isVisible={timePopupOpen}
        initialTime={selectedDay.format('HH:mm')}
      />
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
});

export default EditDateWindow;
