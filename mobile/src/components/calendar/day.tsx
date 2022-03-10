import dayjs from 'dayjs';
import React, {useContext} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';

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
        console.log('press');
        onPress(day);
      }}>
      <View
        style={{
          width: 30,
          height: 30,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 15,
          backgroundColor: isSelected ? '#ccc' : undefined,
          marginVertical: 2,
        }}>
        <Text
          style={{
            color: !monthNum
              ? 'black'
              : day.get('month') + 1 == monthNum
              ? 'black'
              : 'grey',
          }}>
          {day.get('date')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Day;
