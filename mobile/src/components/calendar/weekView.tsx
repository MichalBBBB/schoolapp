import {useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import React, {createRef, useEffect, useState} from 'react';
import {View, FlatList} from 'react-native';
import Week from './week';

interface weekViewProps {
  week: dayjs.Dayjs;
  selectedDay: dayjs.Dayjs;
  onDayPress: (date: dayjs.Dayjs) => void;
  calendarWidth: number;
  weekHeight: number;
  onChangeActiveWeek?: (newWeek: dayjs.Dayjs) => void | undefined;
  scrollToDate?: dayjs.Dayjs | undefined | null;
}

const createWeek = (date: dayjs.Dayjs | string) => {
  if (typeof date == 'string') {
    return date;
  }
  let day = date.startOf('week');
  let week = [];
  for (var i = 0; i < 7; i++) {
    week.push(day);
    day = day.add(1, 'day');
  }
  return week;
};

const pastScrollRange = 10;
const futureScrollRange = 20;

const WeekView: React.FC<weekViewProps> = ({
  week,
  selectedDay,
  onDayPress,
  calendarWidth,
  weekHeight,
  onChangeActiveWeek,
  scrollToDate,
}) => {
  const [weeks, setWeeks] = useState<Array<dayjs.Dayjs | string>>([week]);
  const [index, setIndex] = useState(pastScrollRange);
  const flatListRef = createRef<FlatList>();

  const createDateFromString = (string: string) => {
    const date = string
      .toString()
      .split(' ')
      .map(item => parseInt(item));
    return dayjs(new Date(date[0], date[1] - 1, date[2]));
  };

  const changeVisibility = (newIndex: number) => {
    const weeksCopy = [...weeks];
    for (var i = 0; i < weeks.length; i++) {
      if (
        typeof weeksCopy[i] == 'string' &&
        i >= newIndex - 1 &&
        i <= newIndex + 1
      ) {
        weeksCopy[i] = createDateFromString(weeksCopy[i] as string);
      } else if (
        typeof weeksCopy[i] !== 'string' &&
        i < newIndex - 1 &&
        i > newIndex + 1
      ) {
        const stringDate = (weeksCopy[i] as dayjs.Dayjs).format('YYYY M D');
        weeksCopy[i] = stringDate;
      }
    }
    return weeksCopy;
  };

  useEffect(() => {
    let weeksCopy = [];
    for (var i = 0; i < pastScrollRange + futureScrollRange + 1; i++) {
      let newWeek;
      // if week is close to current week, data is going to be a date - the full calendar will be visible
      if (i >= pastScrollRange - 1 && i <= pastScrollRange + 1) {
        newWeek = week.subtract(pastScrollRange - i, 'week');
      } else {
        // if week is far away from being visible, only a string of the date is added
        newWeek = week.subtract(pastScrollRange - i, 'week').format('YYYY M D');
      }
      weeksCopy.push(newWeek);
    }
    console.log(weeksCopy);
    setWeeks(weeksCopy);
  }, []);

  useEffect(() => {
    if (scrollToDate) {
      const newIndex = weeks.findIndex(value => {
        if (typeof value == 'string') {
          const date = createDateFromString(value);
          if (date.isSame(scrollToDate, 'week')) {
            return true;
          } else {
            return false;
          }
        } else {
          if (value.isSame(scrollToDate, 'week')) {
            return true;
          } else {
            return false;
          }
        }
      });
      console.log(newIndex);
      setWeeks(changeVisibility(newIndex));
      flatListRef.current?.scrollToIndex({
        index: newIndex,
        animated: false,
      });
    }
  }, [scrollToDate]);

  const renderItem = ({item}: {item: dayjs.Dayjs | string}) => {
    return (
      <View style={{width: calendarWidth}}>
        <Week
          week={createWeek(item)}
          selectedDay={selectedDay}
          onDayPress={date => {
            onDayPress(date);
          }}
          calendarWidth={calendarWidth}
          weekHeight={weekHeight}
        />
      </View>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      data={weeks}
      renderItem={renderItem}
      getItemLayout={(item, index) => ({
        length: calendarWidth,
        offset: calendarWidth * index,
        index: index,
      })}
      horizontal={true}
      initialScrollIndex={pastScrollRange}
      snapToOffsets={weeks.map((item, index) => index * calendarWidth)}
      decelerationRate={'fast'}
      removeClippedSubviews={true}
      showsHorizontalScrollIndicator={false}
      onMomentumScrollEnd={item => {
        // change data in months on every scroll
        const newIndex = item.nativeEvent.contentOffset.x / calendarWidth;

        // go through the data array and change months close to viewable to full dates to render full calendars
        const weeksCopy = changeVisibility(newIndex);

        if (
          index !== newIndex &&
          onChangeActiveWeek &&
          typeof weeks[newIndex] !== 'string'
        ) {
          onChangeActiveWeek(weeks[newIndex] as dayjs.Dayjs);
        }
        setIndex(newIndex);
        setWeeks(weeksCopy);
      }}
    />
  );
};

export default WeekView;
