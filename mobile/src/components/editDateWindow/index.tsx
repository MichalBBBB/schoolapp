import {PickerIOS, Picker} from '@react-native-picker/picker';
import dayjs, {Dayjs} from 'dayjs';
import React, {useEffect, useRef, useState} from 'react';
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
import {closestLesson, getTimeOfLessonThisDay} from '../../utils/lessonUtils';
import {BasicButton} from '../basicViews/BasicButton';
import {BasicCard} from '../basicViews/BasicCard';
import {BasicModalCard} from '../basicViews/BasicModalCard';
import {BasicText} from '../basicViews/BasicText';
import Calendar, {CalendarHandle} from '../calendar';
import WeekDays from '../calendar/weekDays';
import {RemindersWindow} from '../remindersWindow';
import SelectTimeModal from '../selectTimeView/selectTimeModal';
import notifee, {AndroidNotificationSetting} from '@notifee/react-native';
import {useSettings} from '../../utils/useSettings';
import {BasicIcon} from '../basicViews/BasicIcon';

interface EditDateWindowProps {
  onSubmit: (date: dayjs.Dayjs, reminderTimes?: number[]) => void;
  initialDate?: dayjs.Dayjs | null;
  subject?: SubjectFragment | undefined | null;
  onClose: () => void;
  isVisible: boolean;
  showReminders?: boolean;
  initialReminderTimes?: number[];
  showTime?: boolean;
  showSpecialDays?: boolean;
}

type SpecialDate = {
  name: string;
  date: dayjs.Dayjs;
  iconSrc: any;
};

const specialDates: SpecialDate[] = [
  {name: 'Today', date: dayjs(), iconSrc: require('../../../assets/Today.png')},
  {
    name: 'Tommorow',
    date: dayjs().add(1, 'day'),
    iconSrc: require('../../../assets/Tomorrow.png'),
  },
  {
    name: 'Next week',
    date: dayjs().add(1, 'week'),
    iconSrc: require('../../../assets/NextWeek.png'),
  },
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
  showSpecialDays = true,
  showTime = true,
  showReminders = false,
}) => {
  const {data: lessons} = useGetAllLessonsQuery();

  const settings = useSettings();

  const [selectedDay, setSelectedDay] = useState<dayjs.Dayjs>(
    initialDate || dayjs(),
  );
  const [monthString, setMonthString] = useState(dayjs().format('MMMM YYYY'));
  const [selectedSpecialDay, setSelectedSpecialDay] =
    useState<SpecialDate | null>(null);
  const [specialDays, setSpecialDays] = useState<SpecialDate[]>(specialDates);
  const [timePopupOpen, setTimePopupOpen] = useState(false);
  const [remindersWindowOpen, setRemindersWindowOpen] = useState(false);
  const [reminderTimes, setReminderTimes] = useState<number[] | undefined>(
    initialReminderTimes,
  );

  const calendarRef = useRef<CalendarHandle>(null);

  useEffect(() => {
    // if there is a subject specified and the subject has assigned lessons,
    // add next lesson as special date
    if (settings) {
      if (
        subject &&
        closestLesson(lessons?.getAllLessons || [], subject, settings)
      ) {
        setSpecialDays([
          ...specialDates,
          {
            name: `Next ${subject.name}`,
            date: dayjs(
              closestLesson(lessons?.getAllLessons || [], subject, settings),
            ),
            iconSrc: require('../../../assets/NextClass.png'),
          },
        ]);
      } else if (!subject && specialDays.length == 4) {
        console.log('here');
        setSpecialDays(specialDays.filter((item, index) => index !== 3));
      }
    }
  }, [subject, settings]);

  const checkPermissions = async () => {
    const settings = await notifee.getNotificationSettings();
    if (settings.android.alarm == AndroidNotificationSetting.ENABLED) {
      return true;
    } else {
      // Show some user information to educate them on what exact alarm permission is,
      // and why it is necessary for your app functionality, then send them to system preferences:
      await notifee.openAlarmPermissionSettings();
      return false;
    }
  };

  const specialDaysView = (
    <View style={{flexDirection: 'row'}}>
      {specialDays.map((item, index) => (
        <View
          key={index}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-start',
            flexDirection: 'row',
          }}>
          <BasicButton
            variant={selectedSpecialDay == item ? 'filled' : 'unstyled'}
            backgroundColor={'accentBackground2'}
            onPress={() => {
              setSelectedSpecialDay(item);
              setSelectedDay(item.date);
            }}
            style={{width: '100%'}}>
            <View style={{alignItems: 'center', width: '100%'}}>
              <BasicIcon
                source={item.iconSrc}
                style={{height: 25, width: 25, marginBottom: 10}}
                color="primary"
              />
              <BasicText style={{textAlign: 'center'}} numberOfLines={2}>
                {item.name}
              </BasicText>
            </View>
          </BasicButton>
        </View>
      ))}
    </View>
  );

  const timeView = (
    <BasicButton
      variant="unstyled"
      onPress={() => setTimePopupOpen(true)}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        // width: '100%',
        alignItems: 'center',
      }}>
      <BasicText>Time</BasicText>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <BasicText>{selectedDay.format('HH:mm')}</BasicText>
        <BasicIcon
          source={require('../../../assets/Chevron-right.png')}
          style={{height: 20, width: 20}}
        />
      </View>
    </BasicButton>
  );

  const remindersView = (
    <BasicButton
      variant="unstyled"
      onPress={() => setRemindersWindowOpen(true)}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
      }}>
      <BasicText>Reminder</BasicText>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <BasicText>
          {reminderTimes?.length == 0
            ? 'None'
            : `${reminderTimes?.length} selected`}
        </BasicText>
        <BasicIcon
          source={require('../../../assets/Chevron-right.png')}
          style={{height: 20, width: 20}}
        />
      </View>
    </BasicButton>
  );

  return (
    <BasicModalCard
      alignCard="center"
      isVisible={isVisible}
      onBackdropPress={() => {
        onClose();
      }}>
      <View style={{alignItems: 'center'}}>
        <View style={{width: '100%', padding: 10, paddingLeft: 20}}>
          <BasicText textVariant="heading">Select Date</BasicText>
        </View>
        <View
          style={{
            height: 34,
            alignItems: 'center',
            paddingHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <Pressable
            onPress={() => {
              calendarRef.current?.goBackwards();
            }}>
            <BasicIcon
              source={require('../../../assets/Chevron-left.png')}
              style={{height: 20, width: 20}}
            />
          </Pressable>
          <BasicText style={{marginRight: 5}}>{monthString}</BasicText>

          <Pressable
            onPress={() => {
              calendarRef.current?.goForward();
            }}>
            <BasicIcon
              source={require('../../../assets/Chevron-right.png')}
              style={{height: 20, width: 20}}
            />
          </Pressable>
        </View>
        <WeekDays weekHeaderHeight={30} width={windowWidth - 20} />
        <View style={{height: calendarHeight}}>
          <Calendar
            ref={calendarRef}
            weekHeight={weekHeight}
            calendarWidth={windowWidth - 20}
            pastScrollRange={2}
            futureScrollRange={20}
            selectedDay={selectedDay}
            onChangeSelectedDay={date => {
              if (subject && settings) {
                const timeOfLesson = getTimeOfLessonThisDay(
                  subject,
                  date,
                  lessons?.getAllLessons || [],
                  settings,
                );
                if (timeOfLesson) {
                  const [hours, minutes] = timeOfLesson.split(':');
                  setSelectedDay(
                    date.hour(parseInt(hours)).minute(parseInt(minutes)),
                  );
                } else {
                  setSelectedDay(
                    date.hour(selectedDay.hour()).minute(selectedDay.minute()),
                  );
                }
              } else {
                setSelectedDay(
                  date.hour(selectedDay.hour()).minute(selectedDay.minute()),
                );
              }
              setSelectedSpecialDay(null);
            }}
            onChangeActiveMonth={newMonth => {
              setMonthString(newMonth.format('MMMM YYYY'));
            }}
          />
        </View>
        {showSpecialDays && specialDaysView}

        <View style={{width: '100%'}}>
          {(showTime || showReminders) && (
            <BasicCard
              backgroundColor="accentBackground2"
              style={{marginHorizontal: 10, marginTop: 10}}>
              {showTime && timeView}
              {showReminders && remindersView}
            </BasicCard>
          )}
        </View>
        <View style={styles.submitButtonContainer}>
          <BasicButton
            style={{flex: 1}}
            onPress={() => {
              onClose();
            }}
            variant={'unstyled'}>
            <BasicText color="textSecondary" style={{fontWeight: 'bold'}}>
              Cancel
            </BasicText>
          </BasicButton>
          <BasicButton
            style={{flex: 1}}
            onPress={() => {
              const date: dayjs.Dayjs = selectedDay;
              onSubmit(date, reminderTimes);
            }}
            variant={'unstyled'}>
            <BasicText color="primary" style={{fontWeight: 'bold'}}>
              Select
            </BasicText>
          </BasicButton>
        </View>
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
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    padding: 5,
    paddingTop: 10,
  },
  specialDatesContainer: {
    flexDirection: 'row',
    width: '100%',
  },
});

export default EditDateModal;
