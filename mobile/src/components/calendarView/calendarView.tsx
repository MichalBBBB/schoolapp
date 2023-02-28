import dayjs from 'dayjs';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {
  Button,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  Pressable,
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
import Calendar, {CalendarHandle} from '../calendar';
import WeekDays from '../calendar/weekDays';
import {
  useGetAllEventsQuery,
  useGetAllLessonsQuery,
} from '../../generated/graphql';
import Event from './event';
import {WEEK_DAY_NUMBERS} from '../../types/weekDays';
import {BasicCard} from '../basicViews/BasicCard';
import DayEvents from './dayEvents';
import {BasicButton} from '../basicViews/BasicButton';
import {BasicText} from '../basicViews/BasicText';
import {useTheme} from '../../contexts/ThemeContext';

// constants
export const calendarWidth = Dimensions.get('screen').width;
export const calendarHeight = 204;
export const weekHeight = 34;
export const weekHeaderHeight = 30;
const pastScrollRange = 10;
const futureScrollRange = 50;

dayjs.extend(relativeTime);

const maxCalendarZIndex = 8;

// function to find the row of given day in active month
const findRowOfDate = (date: dayjs.Dayjs) => {
  const dateOfMonth = date.date();
  const firstDay = date.startOf('M').day();
  console.log('sum', dateOfMonth + firstDay - 2);
  return Math.floor((dateOfMonth + firstDay - 2) / 7);
};

interface calendarProps {
  screenHeight: number;
}

const CalendarView: React.FC<calendarProps> = ({screenHeight}) => {
  const {data: lessons} = useGetAllLessonsQuery();
  const {data} = useGetAllEventsQuery();

  const [theme] = useTheme();

  const [selectedDay, setSelectedDay] = useState(dayjs());
  const [isWeekView, setIsWeekView] = useState(false);
  const [isMonthView, setIsMonthView] = useState(true);
  const y = useSharedValue(0);
  const monthViewOpacity = useSharedValue(1);
  const weekRow = useSharedValue(0);
  const navigation = useNavigation();
  const [monthString, setMonthString] = useState(dayjs().format('MMMM YYYY'));
  const [scrollWeekToDate, setScrollWeekToDate] = useState<dayjs.Dayjs | null>(
    null,
  );

  const calendarRef = useRef<CalendarHandle>(null);
  const weekViewRef = useRef<CalendarHandle>(null);

  useLayoutEffect(() => {
    navigation.setOptions({});
  });

  useEffect(() => {
    weekRow.value = findRowOfDate(selectedDay);
  }, []);

  // animated style for day events
  const dayEventsAnimatedStyle = useAnimatedStyle(() => {
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

  const chevronAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ:
            interpolate(
              y.value,
              [0, -(calendarHeight - weekHeight)],
              [0, -180],
            ).toString() + 'deg',
        },
      ],
    };
  });

  const onDayPress = (date: dayjs.Dayjs) => {
    setSelectedDay(date);
    const row = findRowOfDate(date);
    console.log('row', row);
    weekRow.value = row;
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
      <View>
        <Calendar
          ref={calendarRef}
          weekHeight={34}
          onChangeSelectedDay={onDayPress}
          calendarWidth={calendarWidth}
          pastScrollRange={pastScrollRange}
          futureScrollRange={futureScrollRange}
          selectedDay={selectedDay}
          onChangeActiveMonth={newMonth => {
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
        />
      </View>
    </Animated.View>
  );

  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <View style={{backgroundColor: theme.colors.background, zIndex: 10}}>
        <View
          style={{
            height: 34,
            alignItems: 'center',
            paddingHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <Pressable
            onPress={() => {
              if (isMonthView) {
                calendarRef.current?.goBackwards();
              } else {
                weekViewRef.current?.goBackwards();
              }
            }}>
            <Image
              source={require('../../../assets/Chevron-left.png')}
              style={{height: 20, width: 20}}
            />
          </Pressable>
          <BasicButton
            variant="outlined"
            borderWidth={1}
            backgroundColor={'border'}
            onPress={() => {
              if (isMonthView) {
                setScrollWeekToDate(selectedDay);
                setIsMonthView(false);
                y.value = withTiming(-(calendarHeight - weekHeight), {}, () => {
                  monthViewOpacity.value = 0;
                  runOnJS(setIsWeekView)(true);
                });
              } else {
                setIsWeekView(false);
                monthViewOpacity.value = 1;
                y.value = withTiming(0, {}, () => {
                  runOnJS(setIsMonthView)(true);
                });
              }
            }}
            spacing="s">
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <BasicText style={{marginRight: 5}}>{monthString}</BasicText>
              <Animated.View style={chevronAnimatedStyle}>
                <Image
                  source={require('../../../assets/Chevron-down.png')}
                  style={{height: 20, width: 20}}
                />
              </Animated.View>
            </View>
          </BasicButton>
          <Pressable
            onPress={() => {
              if (isMonthView) {
                calendarRef.current?.goForward();
              } else {
                weekViewRef.current?.goForward();
              }
            }}>
            <Image
              source={require('../../../assets/Chevron-right.png')}
              style={{height: 20, width: 20}}
            />
          </Pressable>
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
          ref={weekViewRef}
          calendarWidth={calendarWidth}
          week={selectedDay}
          onDayPress={onDayPress}
          selectedDay={selectedDay}
          weekHeight={weekHeight}
          onChangeActiveWeek={newWeek => {
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
        />
      </Animated.View>
      {monthView}

      <Animated.View
        style={[
          dayEventsAnimatedStyle,
          {zIndex: 10, backgroundColor: theme.colors.background},
        ]}>
        <DayEvents date={selectedDay} scrollEnabled={isWeekView} />
      </Animated.View>
    </View>
  );
};

export default CalendarView;
