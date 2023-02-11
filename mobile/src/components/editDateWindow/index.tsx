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
import {closestLesson} from '../../utils/lessonUtils';
import {BasicButton} from '../basicViews/BasicButton';
import {BasicModalCard} from '../basicViews/BasicModalCard';
import {BasicText} from '../basicViews/BasicText';
import Calendar from '../calendar';
import WeekDays from '../calendar/weekDays';
import SelectTimeModal from '../selectTimeView/selectTimeModal';

interface EditDateWindowProps {
  onSubmit: (date: dayjs.Dayjs) => void;
  initialDate?: dayjs.Dayjs | null;
  subject?: SubjectFragment | undefined | null;
  onClose: () => void;
  isVisible: boolean;
  onHide?: () => void | undefined;
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

const EditDateModal: React.FC<EditDateWindowProps> = ({
  onSubmit,
  initialDate,
  subject,
  onClose,
  isVisible,
  onHide,
}) => {
  const {data: lessons} = useGetAllLessonsQuery();

  const [selectedDay, setSelectedDay] = useState<dayjs.Dayjs>(
    initialDate || dayjs(),
  );
  const [selectedSpecialDay, setSelectedSpecialDay] =
    useState<SpecialDate | null>(null);
  const [specialDays, setSpecialDays] = useState<SpecialDate[][]>(specialDates);
  const [timePopupOpen, setTimePopupOpen] = useState(false);

  useEffect(() => {
    // if there is a subject specified and the subject has assigned lessons,
    // add next lesson as special date
    if (subject && closestLesson(lessons?.getAllLessons || [], subject)) {
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

  return (
    <BasicModalCard
      alignCard="center"
      isVisible={isVisible}
      onBackdropPress={() => {
        onClose();
      }}
      onModalHide={() => {
        if (onHide) {
          onHide();
        }
      }}>
      {specialDays.map((item, index) => (
        <View key={index} style={styles.specialDatesContainer}>
          {item.map((day, index) => (
            <View
              key={index}
              style={{
                width: windowWidth / 2,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <BasicButton
                variant={selectedSpecialDay == day ? 'filled' : 'unstyled'}
                backgroundColor={'accentBackground'}
                onPress={() => {
                  setSelectedSpecialDay(day);
                  setSelectedDay(day.date);
                }}>
                <BasicText>{day.name}</BasicText>
              </BasicButton>
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
      <BasicButton
        variant="unstyled"
        onPress={() => setTimePopupOpen(true)}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          paddingHorizontal: 30,
        }}>
        <BasicText>Time</BasicText>
        <BasicText>{selectedDay.format('HH:mm')}</BasicText>
      </BasicButton>
      <View style={styles.submitButtonContainer}>
        <BasicButton
          onPress={() => {
            const date: dayjs.Dayjs = selectedDay;
            onSubmit(date);
          }}>
          <BasicText color="background" style={{fontWeight: 'bold'}}>
            Submit
          </BasicText>
        </BasicButton>
      </View>
      <SelectTimeModal
        onClose={() => {
          setTimePopupOpen(false);
        }}
        onSubmit={time => {
          setTimePopupOpen(false);
          setSelectedDay(
            selectedDay
              .hour(parseInt(time.split(':')[0]))
              .minute(parseInt(time.split(':')[1])),
          );
        }}
        isVisible={timePopupOpen}
        initialTime={selectedDay.format('HH:mm')}
      />
    </BasicModalCard>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#666',
    marginLeft: 10,
    marginTop: 20,
  },
  submitButtonContainer: {
    alignItems: 'center',
  },
  specialDatesContainer: {
    flexDirection: 'row',
    width: '100%',
  },
});

export default EditDateModal;
