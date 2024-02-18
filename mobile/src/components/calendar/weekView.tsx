import {useNavigation} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import dayjs from 'dayjs';
import React, {
  createRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {View, FlatList, Platform} from 'react-native';
import {CalendarHandle} from '.';
import {SettingsFragment} from '../../generated/graphql';
import {useSettings} from '../../utils/useSettings';
import Week from './week';
import {WeekViewItem} from './weekViewItem';

interface weekViewProps {
  week: dayjs.Dayjs;
  selectedDay: dayjs.Dayjs;
  onDayPress: (date: dayjs.Dayjs) => void;
  calendarWidth: number;
  weekHeight: number;
  onChangeActiveWeek?: (newWeek: dayjs.Dayjs) => void | undefined;
  pastScrollRange: number;
  futureScrollRange: number;
  daysWithDots?: dayjs.Dayjs[];
}

const WeekView = forwardRef<CalendarHandle, weekViewProps>((props, ref) => {
  const {
    week,
    selectedDay,
    onDayPress,
    calendarWidth,
    weekHeight,
    onChangeActiveWeek,
    pastScrollRange,
    futureScrollRange,
    daysWithDots,
  } = props;

  useImperativeHandle(ref, () => {
    return {
      goForward() {
        if (index + 1 <= weeks.length - 1) {
          flatListRef.current?.scrollToIndex({
            index: index + 1,
            animated: true,
          });
          if (Platform.OS === 'android') {
            updateWeeks(index + 1);
          }
        }
      },
      goBackwards() {
        if (index - 1 >= 0) {
          flatListRef.current?.scrollToIndex({
            index: index - 1,
            animated: true,
          });
          if (Platform.OS === 'android') {
            updateWeeks(index - 1);
          }
        }
      },
    };
  });

  const [weeks, setWeeks] = useState<Array<dayjs.Dayjs | string>>([week]);
  const [index, setIndex] = useState(pastScrollRange);
  const flatListRef = createRef<FlashList<any>>();

  const settings = useSettings();

  const createDateFromString = (string: string) => {
    const date = string
      .toString()
      .split(' ')
      .map(item => parseInt(item));
    return dayjs(new Date(date[0], date[1] - 1, date[2]));
  };

  useEffect(() => {
    const newIndex = weeks.findIndex(value => {
      if (typeof value == 'string') {
        const date = createDateFromString(value);
        if (date.isSame(selectedDay, 'week')) {
          return true;
        } else {
          return false;
        }
      } else {
        if (value.isSame(selectedDay, 'week')) {
          return true;
        } else {
          return false;
        }
      }
    });
    setWeeks(changeVisibility(newIndex));
    flatListRef.current?.scrollToIndex({
      index: newIndex,
      animated: false,
    });
  }, [selectedDay]);

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
    setWeeks(weeksCopy);
  }, []);

  const updateWeeks = (newIndex: number) => {
    // go through the data array and change months close to viewable to full dates to render full calendars
    const weeksCopy = changeVisibility(newIndex);

    if (
      index !== newIndex &&
      onChangeActiveWeek &&
      typeof weeks[newIndex] !== 'string'
    ) {
      onChangeActiveWeek(weeksCopy[newIndex] as dayjs.Dayjs);
    }
    setIndex(newIndex);
    setWeeks(weeksCopy);
  };

  const renderItem = ({item}: {item: dayjs.Dayjs | string}) => {
    return (
      <View style={{width: calendarWidth}}>
        <WeekViewItem
          daysWithDots={daysWithDots || []}
          week={item}
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

  if (weeks.length == 1) {
    return <View style={{height: weekHeight, width: calendarWidth}} />;
  }

  return (
    <FlashList
      ref={flatListRef}
      data={weeks}
      renderItem={renderItem}
      estimatedItemSize={calendarWidth}
      // getItemLayout={(item, index) => ({
      //   length: calendarWidth,
      //   offset: calendarWidth * index,
      //   index: index,
      // })}
      horizontal={true}
      initialScrollIndex={pastScrollRange}
      snapToOffsets={weeks.map((item, index) => index * calendarWidth)}
      decelerationRate={'fast'}
      removeClippedSubviews={true}
      showsHorizontalScrollIndicator={false}
      onMomentumScrollEnd={item => {
        // change data in months on every scroll
        const newIndex = item.nativeEvent.contentOffset.x / calendarWidth;
        updateWeeks(newIndex);
      }}
      extraData={[index, daysWithDots, settings, selectedDay]}
    />
  );
});

export default WeekView;
