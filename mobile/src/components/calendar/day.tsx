import dayjs from 'dayjs';
import React, {memo, useContext, useEffect} from 'react';
<<<<<<< HEAD
import {TouchableOpacity, View, Text} from 'react-native';
=======
import {TouchableOpacity, View, Text, Pressable} from 'react-native';
import {DayWithDot} from '.';
import {useTheme} from '../../contexts/ThemeContext';
>>>>>>> bdcc667252e2be39bf69778b1e7af38577bcdb76
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
            backgroundColor: theme.colors.textTerciary,
          }}
        />
      )}
    </Pressable>
  );
};

export default memo(Day, (prevProps, nextProps) => {
<<<<<<< HEAD
  if (prevProps.isSelected == nextProps.isSelected) {
    return true;
  } else {
    return false;
  }
=======
  if (prevProps.day.dot !== nextProps.day.dot) {
    return false;
  }
  if (prevProps.isSelected !== nextProps.isSelected) {
    return false;
  }
  if (!prevProps.day.date.isSame(nextProps.day.date)) {
    return false;
  }
  return true;
>>>>>>> bdcc667252e2be39bf69778b1e7af38577bcdb76
});
