import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import BackgroundPress from '../backgroundPress';
import Calendar from '../calendar';
import WeekDays from '../calendar/weekDays';

interface EditDateWindowProps {
  onClose: () => void;
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

const EditDateWindow: React.FC<EditDateWindowProps> = ({
  onClose,
  onSubmit,
  initialDate,
}) => {
  const [selectedDay, setSelectedDay] = useState<dayjs.Dayjs | SpecialDate>(
    initialDate || dayjs(),
  );
  const [height, setHeight] = useState(0);
  const [specialDays, setSpecialDays] = useState<SpecialDate[][]>(specialDates);
  const findDimensions = ({height}: {height: number}) => {
    setHeight(height);
  };

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
      }}>
      <BackgroundPress
        onPress={() => {
          onClose();
        }}
      />
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
                }}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor:
                        'get' in selectedDay
                          ? undefined
                          : selectedDay.date == day.date
                          ? '#ccc'
                          : undefined,
                    },
                  ]}
                  onPress={() => {
                    setSelectedDay(day);
                  }}>
                  <Text>{day.name}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
        <WeekDays weekHeaderHeight={30} width={windowWidth - 20} />
        <Calendar
          weekHeight={34}
          calendarWidth={windowWidth - 20}
          pastScrollRange={2}
          futureScrollRange={20}
          selectedDay={'get' in selectedDay ? selectedDay : null}
          onChangeSelectedDay={setSelectedDay}
        />
        <TouchableOpacity
          onPress={() => {
            const date: dayjs.Dayjs =
              'get' in selectedDay ? selectedDay : selectedDay.date;
            onSubmit(date);
          }}>
          <Text>Submit</Text>
        </TouchableOpacity>
      </View>
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
});

export default EditDateWindow;
