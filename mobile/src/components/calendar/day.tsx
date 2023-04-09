import dayjs from 'dayjs';
import React, {memo, useContext, useEffect} from 'react';
import {TouchableOpacity, View, Text, Pressable} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {BasicText} from '../basicViews/BasicText';

interface DayProps {
  day: dayjs.Dayjs;
  isSelected: boolean;
  monthNum: number | undefined;
  onPress: (date: dayjs.Dayjs) => void;
}

const Day: React.FC<DayProps> = ({day, isSelected, monthNum, onPress}) => {
  const [theme] = useTheme();
  return (
    <Pressable
      style={{
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: isSelected ? 15 : undefined,
        backgroundColor: isSelected
          ? theme.colors.accentBackground2
          : undefined,
        marginVertical: 2,
      }}
      onPress={() => {
        onPress(day);
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
    </Pressable>
  );
};

export default memo(Day, (prevProps, nextProps) => {
  if (prevProps.isSelected !== nextProps.isSelected) {
    return false;
  }
  if (!prevProps.day.isSame(nextProps.day)) {
    return false;
  }
  return true;
});
