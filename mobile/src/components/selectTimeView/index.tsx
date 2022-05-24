import {PickerIOS, Picker} from '@react-native-picker/picker';
import React, {useEffect, useState} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {BasicButton} from '../basicViews/BasicButton';

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
          {minutes.map((item, index) => (
            <Picker.Item label={item} value={item} key={index} />
          ))}
        </PickerIOS>
      </View>
      <BasicButton
        style={{padding: 10}}
        onPress={() => {
          if (onSubmit) {
            onSubmit(selectedHour + ':' + selectedMinute);
          }
        }}>
        <Text>Select</Text>
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
