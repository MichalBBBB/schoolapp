import dayjs from 'dayjs';
import React, {createRef, useEffect, useState} from 'react';
import {Dimensions, FlatList, Text, TouchableOpacity, View} from 'react-native';
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
}

const Calendar: React.FC<calendarProps> = ({
  calendarWidth,
  pastScrollRange,
  futureScrollRange,
  selectedDay,
  onChangeSelectedDay,
  weekHeight,
}) => {
  const [month, setMonth] = useState(dayjs());
  const [months, setMonths] = useState<Array<dayjs.Dayjs | string>>([]);
  const [index, setIndex] = useState(pastScrollRange);

  useEffect(() => {
    // populate months array with data
    let monthsCopy = [];
    for (var i = 0; i < pastScrollRange + futureScrollRange + 1; i++) {
      let newMonth;
      // if month is close to current month, data is going to be a date - the full calendar will be visible
      if (i >= pastScrollRange - 1 && i <= pastScrollRange + 1) {
        newMonth = month.subtract(pastScrollRange - i, 'month');
        console.log(newMonth.format('YYYY M'));
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
        const monthsCopy = [...months];
        // go through the data array and change months close to viewable to full dates to render full calendars
        for (var i = 0; i < months.length; i++) {
          if (
            typeof monthsCopy[i] == 'string' &&
            i >= newIndex - 1 &&
            i <= newIndex + 1
          ) {
            const date = monthsCopy[i]
              .toString()
              .split(' ')
              .map(item => parseInt(item));
            monthsCopy[i] = dayjs(new Date(date[0], date[1] - 1));
          } else if (
            typeof monthsCopy[i] !== 'string' &&
            i < newIndex - 1 &&
            i > newIndex + 1
          ) {
            const stringDate = (monthsCopy[i] as dayjs.Dayjs).format('YYYY M');
            monthsCopy[i] = stringDate;
          }
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
