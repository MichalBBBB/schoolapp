import dayjs from 'dayjs';
import React, {memo, useContext} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import {BasicText} from '../basicViews/BasicText';

interface DayProps {
  day: dayjs.Dayjs;
  selectedDay: dayjs.Dayjs | null;
  monthNum: number | undefined;
  onPress: (date: dayjs.Dayjs) => void;
}

const Day: React.FC<DayProps> = ({day, selectedDay, monthNum, onPress}) => {
  const isSelected = day.isSame(selectedDay, 'date');
  return (
    <TouchableOpacity
      onPress={() => {
        onPress(day);
      }}>
      <View
        style={{
          width: 30,
          height: 30,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 15,
          backgroundColor: isSelected ? '#ddd' : undefined,
          marginVertical: 2,
        }}>
        <BasicText
          color={
            !monthNum
              ? 'text'
              : day.get('month') + 1 == monthNum
              ? 'text'
              : 'textSecondary'
          }>
          {day.get('date').toString()}
        </BasicText>
      </View>
    </TouchableOpacity>
  );
};

export default memo(Day);
