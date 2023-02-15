import {PickerIOS, Picker} from '@react-native-picker/picker';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {BasicButton} from '../basicViews/BasicButton';
import {BasicText} from '../basicViews/BasicText';

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

interface SelectTimeViewModalProps {
  onSubmit?: (time: string) => void;
  initialTime?: string | undefined;
}

const SelectTimeView: React.FC<SelectTimeViewModalProps> = ({
  onSubmit,
  initialTime = '8:00',
}) => {
  const [date, setDate] = useState(dayjs(initialTime, 'HH:mm').toDate());

  return (
    <View style={styles.container}>
      <DatePicker
        date={date}
        mode="time"
        androidVariant="nativeAndroid"
        onDateChange={newDate => {
          setDate(newDate);
        }}
      />
      <BasicButton
        style={{padding: 10}}
        onPress={() => {
          if (onSubmit) {
            onSubmit(dayjs(date).format('HH:mm'));
          }
        }}>
        <BasicText color="background">Select</BasicText>
      </BasicButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

export default SelectTimeView;
