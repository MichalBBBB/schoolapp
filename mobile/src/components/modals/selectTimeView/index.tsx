import {PickerIOS, Picker} from '@react-native-picker/picker';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {useTheme} from '../../../contexts/ThemeContext';
import {BasicButton} from '../../basicViews/BasicButton';
import {BasicText} from '../../basicViews/BasicText';

interface SelectTimeViewModalProps {
  onSubmit?: (time: string) => void;
  initialTime?: string | undefined;
}

const SelectTimeView: React.FC<SelectTimeViewModalProps> = ({
  onSubmit,
  initialTime = '8:00',
}) => {
  const [date, setDate] = useState(dayjs(initialTime, 'HH:mm').toDate());

  const [theme] = useTheme();

  return (
    <View style={styles.container}>
      <DatePicker
        date={date}
        mode="time"
        textColor={theme.colors.text}
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
