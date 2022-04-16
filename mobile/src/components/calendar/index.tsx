import dayjs from 'dayjs';
import React, {createRef, useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import relativeTime from 'dayjs/plugin/relativeTime';
import Month from './month';

dayjs.extend(relativeTime);

const weekDays = ['s', 'm', 't', 'w', 't', 'f', 's'];

interface calendarProps {
  calendarWidth: number;
  pastScrollRange: number;
  futureScrollRange: number;
  selectedDay: dayjs.Dayjs | null;
  onChangeSelectedDay: (day: dayjs.Dayjs) => void;
  weekHeight: number;
  onChangeActiveMonth?: (newMonth: dayjs.Dayjs) => void | undefined;
  scrollToDate?: dayjs.Dayjs | null | undefined;
}

const Calendar: React.FC<calendarProps> = ({
  calendarWidth,
  pastScrollRange,
  futureScrollRange,
  selectedDay,
  onChangeSelectedDay,
  weekHeight,
  onChangeActiveMonth,
  scrollToDate,
}) => {
  const [month, setMonth] = useState(dayjs());
  const [months, setMonths] = useState<Array<dayjs.Dayjs | string>>([]);
  const [index, setIndex] = useState(pastScrollRange);

  const createDateFromString = (string: string) => {
    const date = string
      .toString()
      .split(' ')
      .map(item => parseInt(item));
    return dayjs(new Date(date[0], date[1] - 1));
  };

  const changeVisibility = (newIndex: number) => {
    const monthsCopy = [...months];
    for (var i = 0; i < months.length; i++) {
      if (
        typeof monthsCopy[i] == 'string' &&
        i >= newIndex - 1 &&
        i <= newIndex + 1
      ) {
        monthsCopy[i] = createDateFromString(monthsCopy[i] as string);
      } else if (
        typeof monthsCopy[i] !== 'string' &&
        i < newIndex - 1 &&
        i > newIndex + 1
      ) {
        const stringDate = (monthsCopy[i] as dayjs.Dayjs).format('YYYY M');
        monthsCopy[i] = stringDate;
      }
    }
    return monthsCopy;
  };

  useEffect(() => {
    // populate months array with data
    let monthsCopy = [];
    for (var i = 0; i < pastScrollRange + futureScrollRange + 1; i++) {
      let newMonth;
      // if month is close to current month, data is going to be a date - the full calendar will be visible
      if (i >= pastScrollRange - 1 && i <= pastScrollRange + 1) {
        newMonth = month.subtract(pastScrollRange - i, 'month');
      } else {
        // if month is far away from being visible, only a string of the date is added
        newMonth = month
          .subtract(pastScrollRange - i, 'month')
          .format('YYYY M');
      }
      monthsCopy.push(newMonth);
    }
    setMonths(monthsCopy);
  }, []);

  useEffect(() => {
    if (scrollToDate) {
      const newIndex = months.findIndex(value => {
        if (typeof value == 'string') {
          const date = createDateFromString(value);
          if (date.isSame(scrollToDate, 'month')) {
            return true;
          } else {
            return false;
          }
        } else {
          if (value.isSame(scrollToDate, 'month')) {
            return true;
          } else {
            return false;
          }
        }
      });
      console.log(newIndex);
      setMonths(changeVisibility(newIndex));
      flatListRef.current?.scrollToIndex({
        index: newIndex,
        animated: false,
      });
    }
  }, [scrollToDate]);

  const flatListRef = createRef<FlatList>();

  const onDayPress = (date: dayjs.Dayjs) => {
    // if pressed day is in a different month than active, scroll to it
    if (date.month() !== (months[index] as dayjs.Dayjs).month()) {
      flatListRef.current?.scrollToIndex({
        index: date.isBefore(months[index]) ? index - 1 : index + 1,
      });
    }
    onChangeSelectedDay(date);
  };

  const renderItem = ({item}: {item: dayjs.Dayjs | string}) => {
    // console.log(item);
    return (
      <View style={{width: calendarWidth}}>
        <Month
          weekHeight={weekHeight}
          calendarWidth={calendarWidth}
          month={item}
          selectedDay={selectedDay}
          onDayPress={date => {
            onDayPress(date);
          }}
        />
      </View>
    );
  };

  const monthView = (
    <FlatList
      style={{width: calendarWidth}}
      data={months}
      renderItem={renderItem}
      getItemLayout={(item, index) => ({
        length: calendarWidth,
        offset: calendarWidth * index,
        index: index,
      })}
      horizontal={true}
      initialScrollIndex={pastScrollRange}
      snapToOffsets={months.map((item, index) => index * calendarWidth)}
      decelerationRate={'fast'}
      removeClippedSubviews={true}
      showsHorizontalScrollIndicator={false}
      onMomentumScrollEnd={item => {
        // change data in months on every scroll
        const newIndex = item.nativeEvent.contentOffset.x / calendarWidth;

        // go through the data array and change months close to viewable to full dates to render full calendars
        const monthsCopy = changeVisibility(newIndex);
        if (
          index !== newIndex &&
          onChangeActiveMonth &&
          typeof months[newIndex] !== 'string'
        ) {
          onChangeActiveMonth(months[newIndex] as dayjs.Dayjs);
        }
        setIndex(newIndex);
        setMonths(monthsCopy);
      }}
      ref={flatListRef}
      extraData={index}
    />
  );

  return monthView;
};

export default Calendar;
