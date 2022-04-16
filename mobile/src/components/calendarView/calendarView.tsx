import dayjs from 'dayjs';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  Button,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import relativeTime from 'dayjs/plugin/relativeTime';
import {useNavigation} from '@react-navigation/native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import WeekView from '../calendar/weekView';
import Calendar from '../calendar';
import WeekDays from '../calendar/weekDays';
import {useGetAllEventsQuery} from '../../generated/graphql';
import Event from './event';

// constants
export const calendarWidth = Dimensions.get('screen').width;
export const calendarHeight = 204;
export const weekHeight = 34;
export const weekHeaderHeight = 30;
const pastScrollRange = 10;
const futureScrollRange = 50;

dayjs.extend(relativeTime);

const maxCalendarZIndex = 8;

interface calendarProps {
  screenHeight: number;
}

const CalendarView: React.FC<calendarProps> = ({screenHeight}) => {
  const [selectedDay, setSelectedDay] = useState(dayjs());
  const [isWeekView, setIsWeekView] = useState(false);
  const [isMonthView, setIsMonthView] = useState(true);
  const y = useSharedValue(0);
  const monthViewOpacity = useSharedValue(1);
  const weekRow = useSharedValue(0);
  const {data} = useGetAllEventsQuery();
  const navigation = useNavigation();
  const [activeMonth, setActiveMonth] = useState(dayjs());
  const [activeWeek, setActiveWeek] = useState(dayjs());
  const [monthString, setMonthString] = useState(dayjs().format('MMMM YYYY'));
  const [scrollWeekToDate, setScrollWeekToDate] = useState<dayjs.Dayjs | null>(
    null,
  );
  const [scrollMonthToDate, setScrollMonthToDate] =
    useState<dayjs.Dayjs | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({});
  });

  // function to find the row of given day in active month
  const findRowOfDate = (date: dayjs.Dayjs) => {
    const dateOfMonth = date.date();
    const firstDay = date.startOf('M').day();
    return Math.floor((dateOfMonth + firstDay - 1) / 7);
  };

  useEffect(() => {
    weekRow.value = findRowOfDate(selectedDay);
  }, []);

  // animated style for data of a specific day
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: screenHeight - (calendarHeight + weekHeaderHeight + 34) - y.value,
    };
  });

  // animated style for main calendar
  const calendarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          // translation is interpolated between initial and final position
          translateY: interpolate(
            y.value,
            [0, -(calendarHeight - weekHeight)],
            [0, -weekHeight * weekRow.value],
          ),
        },
      ],
      opacity: monthViewOpacity.value,
    };
  });

  const weekViewAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - monthViewOpacity.value,
    };
  });

  const onDayPress = (date: dayjs.Dayjs) => {
    setSelectedDay(date);
    setActiveWeek(date);
    weekRow.value = findRowOfDate(date);
  };

  const monthView = (
    <Animated.View
      style={[
        {
          position: 'absolute',
          marginTop: weekHeaderHeight + 34,
          zIndex: !isWeekView ? maxCalendarZIndex : 1,
        },
        calendarAnimatedStyle,
      ]}>
      <Calendar
        weekHeight={34}
        onChangeSelectedDay={onDayPress}
        calendarWidth={calendarWidth}
        pastScrollRange={pastScrollRange}
        futureScrollRange={futureScrollRange}
        selectedDay={selectedDay}
        onChangeActiveMonth={newMonth => {
          setActiveMonth(newMonth);
          let newSelectedDay;
          if (newMonth.isSame(dayjs(), 'month')) {
            newSelectedDay = dayjs();
          } else if (selectedDay.isSame(newMonth, 'month')) {
            newSelectedDay = selectedDay;
          } else {
            newSelectedDay = newMonth.startOf('month');
          }
          weekRow.value = findRowOfDate(newSelectedDay);
          setSelectedDay(newSelectedDay);
          setMonthString(newMonth.format('MMMM YYYY'));
        }}
        scrollToDate={scrollMonthToDate}
      />
    </Animated.View>
  );

  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <View style={{backgroundColor: 'white', zIndex: 10}}>
        <View
          style={{
            height: 34,
            alignItems: 'center',
            paddingLeft: 20,
            flexDirection: 'row',
            width: '100%',
          }}>
          <TouchableOpacity
            onPress={() => {
              if (isMonthView) {
                setScrollWeekToDate(selectedDay);
                setIsMonthView(false);
                y.value = withTiming(-(calendarHeight - weekHeight), {}, () => {
                  monthViewOpacity.value = 0;
                  runOnJS(setIsWeekView)(true);
                });
              } else {
                setScrollMonthToDate(selectedDay);
                setIsWeekView(false);
                monthViewOpacity.value = 1;
                y.value = withTiming(0, {}, () => {
                  runOnJS(setIsMonthView)(true);
                });
              }
            }}
            style={{
              backgroundColor: '#ddd',
              padding: 5,
              borderRadius: 10,
              marginRight: 10,
            }}>
            <Text>{monthString}</Text>
          </TouchableOpacity>
          {/* {isWeekView && (
            <Text style={{color: '#777'}}>{selectedDay.fromNow()}</Text>
          )} */}
        </View>
        <WeekDays weekHeaderHeight={weekHeaderHeight} width={calendarWidth} />
      </View>
      <Animated.View
        style={[
          {
            position: 'absolute',
            marginTop: weekHeaderHeight + 34,
            zIndex: isMonthView ? 1 : maxCalendarZIndex,
          },
          weekViewAnimatedStyle,
        ]}>
        <WeekView
          calendarWidth={calendarWidth}
          week={selectedDay}
          onDayPress={onDayPress}
          selectedDay={selectedDay}
          weekHeight={weekHeight}
          onChangeActiveWeek={newWeek => {
            setActiveWeek(newWeek);
            weekRow.value = findRowOfDate(newWeek);
            let newSelectedDay;
            if (newWeek.isSame(dayjs(), 'week')) {
              newSelectedDay = dayjs();
            } else if (selectedDay.isSame(newWeek, 'week')) {
              newSelectedDay = selectedDay;
            } else {
              newSelectedDay = newWeek.startOf('week');
            }
            setSelectedDay(newSelectedDay);
            setMonthString(newWeek.format('MMMM YYYY'));
          }}
          scrollToDate={scrollWeekToDate}
        />
      </Animated.View>
      {monthView}
      {data?.getAllEvents.filter(item =>
        dayjs(item.startDate).isSame(selectedDay, 'day'),
      ).length !== 0 ? (
        <Animated.View style={[animatedStyle, {zIndex: 10}]}>
          <FlatList
            data={data?.getAllEvents.filter(item =>
              dayjs(item.startDate).isSame(selectedDay, 'day'),
            )}
            renderItem={({item}) => <Event event={item} />}
            scrollEnabled={isWeekView}
            style={{flex: 1, backgroundColor: 'white', paddingTop: 5}}
          />
        </Animated.View>
      ) : (
        <Animated.View
          style={[
            {
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              backgroundColor: 'white',
              zIndex: 10,
            },
            animatedStyle,
          ]}>
          <Text style={{color: '#ccc', fontSize: 24, fontWeight: 'bold'}}>
            Nothing for this day
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

export default CalendarView;
