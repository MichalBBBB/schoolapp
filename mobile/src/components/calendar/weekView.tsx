import {useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {calendarWidth} from '.';
import Week from './week';

interface weekViewProps {
  week: dayjs.Dayjs;
  selectedDay: dayjs.Dayjs;
  onDayPress: (date: dayjs.Dayjs) => void;
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

const WeekView: React.FC<weekViewProps> = ({week, selectedDay, onDayPress}) => {
  const [weeks, setWeeks] = useState<Array<dayjs.Dayjs | string>>([week]);
  const [index, setIndex] = useState(pastScrollRange);
  const navigation = useNavigation();

  useEffect(() => {
    let weeksCopy = [];
    for (var i = 0; i < pastScrollRange + futureScrollRange + 1; i++) {
      let newWeek;
      // if month is close to current month, data is going to be a date - the full calendar will be visible
      if (i >= pastScrollRange - 1 && i <= pastScrollRange + 1) {
        newWeek = week.subtract(pastScrollRange - i, 'week');
      } else {
        // if month is far away from being visible, only a string of the date is added
        newWeek = week.subtract(pastScrollRange - i, 'week').format('YYYY M D');
      }
      weeksCopy.push(newWeek);
    }
    setWeeks(weeksCopy);
  }, []);

  const renderItem = ({item}: {item: dayjs.Dayjs | string}) => {
    return (
      <View style={{width: calendarWidth}}>
        <Week
          week={createWeek(item)}
          selectedDay={selectedDay}
          onDayPress={date => {
            console.log('weekview');
            onDayPress(date);
          }}
        />
      </View>
    );
  };

  return (
    <FlatList
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
        const weeksCopy = [...weeks];
        // go through the data array and change months close to viewable to full dates to render full calendars
        for (var i = 0; i < weeks.length; i++) {
          if (
            typeof weeksCopy[i] == 'string' &&
            i >= newIndex - 1 &&
            i <= newIndex + 1
          ) {
            const date = weeksCopy[i]
              .toString()
              .split(' ')
              .map(item => parseInt(item));
            weeksCopy[i] = dayjs(new Date(date[0], date[1] - 1, date[2]));
          } else if (
            typeof weeksCopy[i] !== 'string' &&
            i < newIndex - 1 &&
            i > newIndex + 1
          ) {
            const stringDate = (weeksCopy[i] as dayjs.Dayjs).format('YYYY M D');
            weeksCopy[i] = stringDate;
          }
        }
        setIndex(newIndex);
        setWeeks(weeksCopy);
        // change header title to current month
        navigation.setOptions({
          title: (weeksCopy[newIndex] as dayjs.Dayjs).format('MMMM'),
        });
      }}
    />
  );
};

export default WeekView;
