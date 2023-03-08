import React, {useEffect} from 'react';
import dayjs from 'dayjs';
import {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {BasicModalCard, BasicModalCardProps} from './basicViews/BasicModalCard';
import {BasicRadio} from './basicViews/BasicRadio';
import {BasicCardProps} from './basicViews/BasicCard';
import {BasicText} from './basicViews/BasicText';
import {BasicButton} from './basicViews/BasicButton';
import {sendNotification, setNotificationTrigger} from '../utils/notifications';

interface RemindersWindowProps {
  onSubmit: (reminderTImes: number[]) => void;
  onClose: () => void;
  isVisible: boolean;
  initialReminderTimes?: number[];
}

type ReminderTime = {
  title: string;
  minutesBefore: number;
};

const reminderTimes: ReminderTime[] = [
  {
    title: 'At the time',
    minutesBefore: 0,
  },
  {
    title: '10 minutes early',
    minutesBefore: 1,
  },
  {
    title: '30 minutes early',
    minutesBefore: 2,
  },
  {
    title: '1 hour early',
    minutesBefore: 3,
  },
  {
    title: '2 hours early',
    minutesBefore: 120,
  },
  {
    title: '1 day early',
    minutesBefore: 60 * 24,
  },
];

export const RemindersWindow: React.FC<RemindersWindowProps> = ({
  isVisible,
  onClose,
  onSubmit,
  initialReminderTimes = [],
}) => {
  const [selectedReminderTimes, setSelectedReminderTimes] =
    useState<number[]>(initialReminderTimes);

  return (
    <BasicModalCard
      style={{marginHorizontal: 20}}
      alignCard="center"
      isVisible={isVisible}
      onBackdropPress={() => {
        onClose();
      }}>
      <View style={{width: '100%', padding: 10, paddingLeft: 20}}>
        <BasicText textVariant="heading">Reminders</BasicText>
      </View>
      <View style={styles.reminderTimesContainer}>
        <View style={{flexDirection: 'row', marginBottom: 10}}>
          <BasicRadio
            style={{marginRight: 10}}
            toggled={selectedReminderTimes.length == 0}
            onToggle={toggled => {
              setSelectedReminderTimes([]);
            }}
          />
          <BasicText>None</BasicText>
        </View>
        {reminderTimes.map((item, index) => (
          <View key={index} style={{flexDirection: 'row', marginBottom: 10}}>
            <BasicRadio
              style={{marginRight: 10}}
              toggled={selectedReminderTimes.includes(item.minutesBefore)}
              onToggle={toggled => {
                if (toggled) {
                  setSelectedReminderTimes([
                    ...selectedReminderTimes,
                    item.minutesBefore,
                  ]);
                } else {
                  setSelectedReminderTimes(
                    selectedReminderTimes.filter(
                      time => time !== item.minutesBefore,
                    ),
                  );
                }
              }}
            />
            <BasicText>{item.title}</BasicText>
          </View>
        ))}
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
            onSubmit(selectedReminderTimes);
          }}
          variant={'unstyled'}>
          <BasicText color="primary" style={{fontWeight: 'bold'}}>
            Select
          </BasicText>
        </BasicButton>
      </View>
    </BasicModalCard>
  );
};

const styles = StyleSheet.create({
  submitButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    padding: 5,
    paddingTop: 10,
  },
  reminderTimesContainer: {
    marginHorizontal: 15,
    marginTop: 5,
  },
});