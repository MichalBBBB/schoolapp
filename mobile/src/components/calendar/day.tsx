import dayjs from 'dayjs';
import React, {memo, useContext, useEffect} from 'react';
import {TouchableOpacity, View, Text, Pressable} from 'react-native';
import {DayWithDot} from '.';
import {useTheme} from '../../contexts/ThemeContext';
import {BasicText} from '../basicViews/BasicText';

interface DayProps {
  day: DayWithDot;
  isSelected: boolean;
  monthNum: number | undefined;
  onPress: (date: dayjs.Dayjs) => void;
  weekHeight: number;
}

const Day: React.FC<DayProps> = ({
  day,
  isSelected,
  monthNum,
  onPress,
  weekHeight,
}) => {
  const [theme] = useTheme();
  return (
    <Pressable
      style={{
        width: weekHeight,
        height: weekHeight,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: isSelected ? weekHeight / 2 : undefined,
        backgroundColor: isSelected
          ? theme.colors.accentBackground2
          : undefined,
      }}
      onPress={() => {
        onPress(day.date);
      }}>
      <BasicText
        style={{fontSize: 15}}
        color={
          !monthNum
            ? 'text'
            : day.date.get('month') + 1 == monthNum
            ? 'text'
            : 'textSecondary'
        }>
        {day.date.get('date').toString()}
      </BasicText>

      {day.dot && (
        <View
          style={{
            position: 'absolute',
            bottom: 3,
            borderRadius: 5,
            height: 5,
            width: 5,
            backgroundColor: theme.colors.accent,
          }}
        />
      )}
    </Pressable>
  );
};

export default memo(Day);
