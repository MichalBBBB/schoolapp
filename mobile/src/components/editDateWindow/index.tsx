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
  Image,
} from 'react-native';
import {
  Reminder,
  ReminderFragment,
  SubjectFragment,
  useGetAllLessonsQuery,
} from '../../generated/graphql';
import {closestLesson} from '../../utils/lessonUtils';
import {BasicButton} from '../basicViews/BasicButton';
import {BasicModalCard} from '../basicViews/BasicModalCard';
import {BasicText} from '../basicViews/BasicText';
import Calendar from '../calendar';
import WeekDays from '../calendar/weekDays';
import {RemindersWindow} from '../remindersWindow';
import SelectTimeModal from '../selectTimeView/selectTimeModal';

interface EditDateWindowProps {
  onSubmit: (date: dayjs.Dayjs, reminderTimes?: number[]) => void;
  initialDate?: dayjs.Dayjs | null;
  subject?: SubjectFragment | undefined | null;
  onClose: () => void;
  isVisible: boolean;
  onHide?: () => void | undefined;
  reminders?: boolean;
  initialReminderTimes?: number[];
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
  initialReminderTimes,
  subject,
  onClose,
  isVisible,
  onHide,
  reminders = false,
}) => {
  const {data: lessons} = useGetAllLessonsQuery();

  const [selectedDay, setSelectedDay] = useState<dayjs.Dayjs>(
    initialDate || dayjs(),
  );
  const [selectedSpecialDay, setSelectedSpecialDay] =
    useState<SpecialDate | null>(null);
  const [specialDays, setSpecialDays] = useState<SpecialDate[][]>(specialDates);
  const [timePopupOpen, setTimePopupOpen] = useState(false);
  const [remindersWindowOpen, setRemindersWindowOpen] = useState(false);
  const [reminderTimes, setReminderTimes] = useState<number[] | undefined>(
    undefined,
  );

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
      }}>
      <View style={{alignItems: 'center'}}>
        {specialDays.map((item, index1) => (
          <View key={index1} style={styles.specialDatesContainer}>
            {item.map((day, index2) => (
              <View
                key={index2}
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
            marginTop: 10,
          }}>
          <BasicText>Time</BasicText>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <BasicText>{selectedDay.format('HH:mm')}</BasicText>
            <Image
              source={require('../../../assets/Chevron-right.png')}
              style={{height: 20, width: 20}}
            />
          </View>
        </BasicButton>
        {reminders && (
          <BasicButton
            variant="unstyled"
            onPress={() => setRemindersWindowOpen(true)}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              paddingHorizontal: 30,
              marginTop: 10,
            }}>
            <BasicText>Reminder</BasicText>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {/* <BasicText>{selectedDay.format('HH:mm')}</BasicText> */}
              <Image
                source={require('../../../assets/Chevron-right.png')}
                style={{height: 20, width: 20}}
              />
            </View>
          </BasicButton>
        )}

        <View style={styles.submitButtonContainer}>
          <BasicButton
            onPress={() => {
              const date: dayjs.Dayjs = selectedDay;
              onSubmit(date, reminderTimes);
            }}>
            <BasicText color="background" style={{fontWeight: 'bold'}}>
              Submit
            </BasicText>
          </BasicButton>
        </View>
        <RemindersWindow
          initialReminderTimes={initialReminderTimes}
          isVisible={remindersWindowOpen}
          onClose={() => setRemindersWindowOpen(false)}
          onSubmit={value => {
            setReminderTimes(value);
            setRemindersWindowOpen(false);
          }}
        />
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
      </View>
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
