import {PickerIOS, Picker} from '@react-native-picker/picker';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {useTheme} from '../../../contexts/ThemeContext';
import {BasicButton} from '../../basicViews/BasicButton';
import {BasicText} from '../../basicViews/BasicText';

interface SelectTimeViewModalProps {
  onSubmit?: (time: string | null) => void;
  initialTime?: string | undefined;
  onClose: () => void;
  allowClear?: boolean;
}

const SelectTimeView: React.FC<SelectTimeViewModalProps> = ({
  onSubmit,
  initialTime = '8:00',
  onClose,
  allowClear = false,
}) => {
  const [date, setDate] = useState(dayjs(initialTime, 'HH:mm').toDate());

  const [theme] = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          padding: 10,
        }}>
        <BasicText textVariant="heading">Select Time</BasicText>
        {allowClear && (
          <BasicButton
            variant="unstyled"
            onPress={() => {
              onSubmit?.(null);
            }}>
            <BasicText>Clear</BasicText>
          </BasicButton>
        )}
      </View>
      <DatePicker
        date={date}
        mode="time"
        textColor={theme.colors.text}
        androidVariant="nativeAndroid"
        onDateChange={newDate => {
          setDate(newDate);
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          paddingHorizontal: 20,
          padding: 5,
          paddingTop: 10,
        }}>
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
            if (onSubmit) {
              onSubmit(dayjs(date).format('HH:mm'));
            }
          }}
          variant={'unstyled'}>
          <BasicText color="primary" style={{fontWeight: 'bold'}}>
            Select
          </BasicText>
        </BasicButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

export default SelectTimeView;
