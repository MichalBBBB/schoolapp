import {PickerIOS, Picker} from '@react-native-picker/picker';
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
  const [selectedHour, setSelectedHour] = useState(initialTime.split(':')[0]);
  const [selectedMinute, setSelectedMinute] = useState(
    initialTime.split(':')[1],
  );

  return (
    <View style={styles.container}>
      <DatePicker
        date={new Date()}
        mode="time"
        androidVariant="nativeAndroid"
      />
      <BasicButton
        style={{padding: 10}}
        onPress={() => {
          if (onSubmit) {
            onSubmit(selectedHour + ':' + selectedMinute);
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
