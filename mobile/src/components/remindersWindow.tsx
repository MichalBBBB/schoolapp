import React from 'react';
import dayjs from 'dayjs';
import {useState} from 'react';
import {View} from 'react-native';
import {BasicModalCard, BasicModalCardProps} from './basicViews/BasicModalCard';
import {BasicRadio} from './basicViews/BasicRadio';
import {BasicCardProps} from './basicViews/BasicCard';
import {BasicText} from './basicViews/BasicText';
import {BasicButton} from './basicViews/BasicButton';

interface RemindersWindowProps {
  onSubmit: (date: dayjs.Dayjs) => void;
  onClose: () => void;
  isVisible: boolean;
  onHide?: () => void | undefined;
}

type ReminderTime = {
  title: string;
  getDate: (date: dayjs.Dayjs) => dayjs.Dayjs;
};

const reminderTimes: ReminderTime[] = [
  {
    title: 'At the time',
    getDate: date => date,
  },
  {
    title: '10 minutes early',
    getDate: date => date.subtract(10, 'minute'),
  },
  {
    title: '30 minutes early',
    getDate: date => date.subtract(30, 'minutes'),
  },
  {
    title: '1 hour early',
    getDate: date => date.subtract(1, 'hour'),
  },
  {
    title: '2 hours early',
    getDate: date => date.subtract(2, 'hours'),
  },
  {
    title: '1 day early',
    getDate: date => date.subtract(1, 'day'),
  },
];

export const RemindersWindow: React.FC<RemindersWindowProps> = ({
  isVisible,
  onClose,
  onSubmit,
  onHide,
  ...rest
}) => {
  const [selectedReminderTimes, setSelectedReminderTimes] = useState<
    ReminderTime[]
  >([]);
  return (
    <BasicModalCard
      spacing="l"
      style={{marginHorizontal: 20}}
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
      {reminderTimes.map((item, index) => (
        <View style={{flexDirection: 'row', marginBottom: 10}}>
          <BasicRadio
            style={{marginRight: 10}}
            toggled={selectedReminderTimes
              .map(item => item.title)
              .includes(item.title)}
            onToggle={toggled => {
              if (toggled) {
                setSelectedReminderTimes([...selectedReminderTimes, item]);
              } else {
                setSelectedReminderTimes(
                  selectedReminderTimes.filter(
                    time => time.title !== item.title,
                  ),
                );
              }
            }}
          />
          <BasicText>{item.title}</BasicText>
        </View>
      ))}
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <BasicButton spacing="m">
          <BasicText color="textContrast" textVariant="button">
            Submit
          </BasicText>
        </BasicButton>
      </View>
    </BasicModalCard>
  );
};
