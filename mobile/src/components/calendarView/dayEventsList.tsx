import dayjs from 'dayjs';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Dimensions, FlatList, View} from 'react-native';
import {BasicText} from '../basicViews/BasicText';
import DayEvents from './dayEvents';

export const width = Dimensions.get('screen').width;

interface DayEventsListProps {
  day: dayjs.Dayjs;
  onScroll: (newDay: dayjs.Dayjs) => void;
  pastScrollRange: number;
  futureScrollRange: number;
  scrollEnabled: boolean;
}

const createList = (pastScrollRange: number, futureScrollRange: number) => {
  let days = [];
  for (var i = 0; i < pastScrollRange + futureScrollRange + 1; i++) {
    let newDay;
    // if month is close to current month, data is going to be a date - the full calendar will be visible
    if (i >= pastScrollRange - 1 && i <= pastScrollRange + 1) {
      newDay = dayjs().subtract(pastScrollRange - i, 'day');
    } else {
      // if month is far away from being visible, only a string of the date is added
      newDay = dayjs()
        .subtract(pastScrollRange - i, 'day')
        .format('YYYY M D');
    }
    days.push(newDay);
  }
  return days;
};

export const DayEventsList: React.FC<DayEventsListProps> = ({
  day,
  onScroll,
  pastScrollRange,
  futureScrollRange,
  scrollEnabled,
}) => {
  const [days, setDays] = useState<Array<string | dayjs.Dayjs>>([]);
  const [index, setIndex] = useState(pastScrollRange);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const newDays = createList(pastScrollRange, futureScrollRange);
    setDays(newDays);
  }, []);

  const createDateFromString = (string: string) => {
    const date = string
      .toString()
      .split(' ')
      .map(item => parseInt(item));
    return dayjs(new Date(date[0], date[1] - 1, date[2]));
  };

  useEffect(() => {
    if (days.length !== 0) {
      const newIndex = days.findIndex(value => {
        if (typeof value == 'string') {
          const date = createDateFromString(value);
          if (date.isSame(day, 'day')) {
            return true;
          } else {
            return false;
          }
        } else {
          if (value.isSame(day, 'day')) {
            return true;
          } else {
            return false;
          }
        }
      });
      setDays(changeVisibility(newIndex));
      setIndex(newIndex);
      flatListRef.current?.scrollToIndex({
        index: newIndex,
        animated: false,
      });
    }
  }, [day]);

  const changeVisibility = (newIndex: number) => {
    const daysCopy = [...days];
    for (var i = 0; i < days.length; i++) {
      if (
        typeof daysCopy[i] == 'string' &&
        i >= newIndex - 1 &&
        i <= newIndex + 1
      ) {
        daysCopy[i] = createDateFromString(daysCopy[i] as string);
      } else if (
        typeof daysCopy[i] !== 'string' &&
        i < newIndex - 1 &&
        i > newIndex + 1
      ) {
        const stringDate = (daysCopy[i] as dayjs.Dayjs).format('YYYY M D');
        daysCopy[i] = stringDate;
      }
    }
    return daysCopy;
  };

  if (days.length == 1) {
    return <View style={{height: '100%', width: width}} />;
  }

  return (
    <FlatList
      windowSize={3}
      removeClippedSubviews={true}
      scrollEnabled={scrollEnabled}
      ref={flatListRef}
      horizontal={true}
      initialScrollIndex={pastScrollRange}
      snapToOffsets={days.map((item, index) => index * width)}
      decelerationRate={'fast'}
      getItemLayout={(item, index) => ({
        length: width,
        offset: width * index,
        index: index,
      })}
      onMomentumScrollEnd={item => {
        const newIndex = Math.round(item.nativeEvent.contentOffset.x / width);
        const newMonths = changeVisibility(newIndex);
        if (newIndex !== index) {
          onScroll(newMonths[newIndex] as dayjs.Dayjs);
        }
        setDays(newMonths);
        setIndex(newIndex);
      }}
      data={days}
      renderItem={({item, index}) => {
        if (typeof item == 'string') {
          return (
            <View
              key={index}
              style={{
                width: width,
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <BasicText>{item}</BasicText>
            </View>
          );
        } else {
          return (
            <DayEvents date={item} scrollEnabled={scrollEnabled} key={index} />
          );
        }
      }}
    />
  );
};
