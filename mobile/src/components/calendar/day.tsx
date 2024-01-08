import dayjs from 'dayjs';
import React, {memo, useContext, useEffect} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import {BasicText} from '../basicViews/BasicText';

interface DayProps {
  day: dayjs.Dayjs;
  isSelected: boolean;
  monthNum: number | undefined;
  onPress: (date: dayjs.Dayjs) => void;
}

const Day: React.FC<DayProps> = ({day, isSelected, monthNum, onPress}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        console.log(day);
        onPress(day);
      }}>
      <View
        style={{
          width: 30,
          height: 30,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: isSelected ? 15 : undefined,
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

export default memo(Day, (prevProps, nextProps) => {
  if (prevProps.isSelected == nextProps.isSelected) {
    return true;
  } else {
    return false;
  }
});
