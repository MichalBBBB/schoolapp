import dayjs from 'dayjs';
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Button,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  Pressable,
  TouchableWithoutFeedback,
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
  useGetAllTasksQuery,
} from '../../generated/graphql';
import Event from './event';
import {WEEK_DAY_NUMBERS} from '../../types/weekDays';
import {BasicCard} from '../basicViews/BasicCard';
import DayEvents from './dayEvents';
import {BasicButton} from '../basicViews/BasicButton';
import {BasicText} from '../basicViews/BasicText';
import {useTheme} from '../../contexts/ThemeContext';
import {useSettings} from '../../utils/useSettings';
import {BasicIcon} from '../basicViews/BasicIcon';
import {DayEventsList} from './dayEventsList';

// constants
export const calendarWidth = Dimensions.get('screen').width;
export const calendarHeight = 204;
export const weekHeight = 34;
export const weekHeaderHeight = 30;
const pastScrollRange = 10;
const futureScrollRange = 20;

dayjs.extend(relativeTime);

const maxCalendarZIndex = 8;

// function to find the row of given day in active month
const findRowOfDate = (date: dayjs.Dayjs) => {
  const dateOfMonth = date.date();
  const firstDay = date.startOf('M').weekday();
  return Math.floor((dateOfMonth + firstDay - 1) / 7);
};

interface calendarProps {
  screenHeight: number;
}

const CalendarView: React.FC<calendarProps> = ({screenHeight}) => {
  const {data: events} = useGetAllEventsQuery();
  const {data: tasks} = useGetAllTasksQuery();

  const [theme] = useTheme();

  const [selectedDay, setSelectedDay] = useState(dayjs());
  const [isWeekView, setIsWeekView] = useState(true);
  const [isMonthView, setIsMonthView] = useState(false);
  const y = useSharedValue(-(calendarHeight - weekHeight));
  const monthViewOpacity = useSharedValue(0);
  const weekRow = useSharedValue(0);
  const navigation = useNavigation();
  const [monthString, setMonthString] = useState(dayjs().format('MMMM YYYY'));

  const calendarRef = useRef<CalendarHandle>(null);
  const weekViewRef = useRef<CalendarHandle>(null);

  const daysWithDots = useMemo(() => {
    const list: dayjs.Dayjs[] = [];
    tasks?.getAllTasks.forEach(item => {
      if (item.doDate && !list.some(day => day.isSame(item.doDate, 'day'))) {
        list.push(dayjs(item.doDate));
      }
    });
    events?.getAllEvents.forEach(item => {
      if (
        item.startDate &&
        !list.some(day => day.isSame(item.startDate, 'day'))
      ) {
        list.push(dayjs(item.startDate));
      }
    });
    return list;
  }, [tasks, events]);

  useEffect(() => {
    weekRow.value = findRowOfDate(selectedDay);
  }, []);

  // animated style for day events
  const dayEventsAnimatedStyle = useAnimatedStyle(() => {
    return {
      // height: screenHeight - (calendarHeight + weekHeaderHeight + 34) - y.value,
      top: calendarHeight + y.value,
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
    weekRow.value = row;
  };

  const toggleMonthView = () => {
    if (isMonthView) {
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
          daysWithDots={daysWithDots}
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
            <BasicIcon
              source={require('../../../assets/Chevron-left.png')}
              style={{height: 20, width: 20}}
            />
          </Pressable>
          <BasicButton
            variant="filled"
            borderWidth={1}
            backgroundColor={'accentBackground1'}
            style={{paddingHorizontal: 15}}
            onPress={() => {
              toggleMonthView();
            }}
            spacing="s">
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <BasicText style={{marginRight: 5}}>{monthString}</BasicText>
              <Animated.View style={chevronAnimatedStyle}>
                <BasicIcon
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
            <BasicIcon
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
          daysWithDots={daysWithDots}
          futureScrollRange={dayjs()
            .add(futureScrollRange, 'month')
            .endOf('month')
            .endOf('week')
            .diff(dayjs(), 'week')}
          pastScrollRange={Math.abs(
            dayjs()
              .subtract(pastScrollRange, 'month')
              .startOf('month')
              .startOf('week')
              .diff(dayjs(), 'week'),
          )}
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
            weekRow.value = findRowOfDate(newSelectedDay);
            setSelectedDay(newSelectedDay);
            setMonthString(newWeek.format('MMMM YYYY'));
          }}
        />
      </Animated.View>
      {monthView}

      <Animated.View
        style={[
          dayEventsAnimatedStyle,
          {
            zIndex: 10,
            backgroundColor: theme.colors.background,
            height: screenHeight - (weekHeight + weekHeaderHeight),
          },
        ]}>
        <View style={{height: '100%'}}>
          <DayEventsList
            height={screenHeight - (weekHeight + weekHeaderHeight)}
            scrollEnabled={isWeekView}
            pastScrollRange={Math.abs(
              dayjs()
                .subtract(pastScrollRange, 'month')
                .startOf('month')
                .startOf('week')
                .diff(dayjs(), 'day'),
            )}
            futureScrollRange={dayjs()
              .add(futureScrollRange, 'month')
              .endOf('month')
              .endOf('week')
              .diff(dayjs(), 'day')}
            day={selectedDay}
            onScroll={newDay => {
              weekRow.value = findRowOfDate(newDay);
              setSelectedDay(newDay);
            }}
          />

          {isMonthView && (
            <View
              style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
              }}>
              <TouchableWithoutFeedback
                onPress={() => {
                  toggleMonthView();
                }}>
                <View style={{width: '100%', height: '100%'}} />
              </TouchableWithoutFeedback>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

{
  /* <Animated.View
        style={[
          dayEventsAnimatedStyle,
          {zIndex: 10, backgroundColor: theme.colors.background},
        ]}>
        <View style={{height: '100%'}}>
          <DayEvents date={selectedDay} scrollEnabled={isWeekView} />
          {isMonthView && (
            <View
              style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
              }}>
              <TouchableWithoutFeedback
                onPress={() => {
                  toggleMonthView();
                }}>
                <View style={{width: '100%', height: '100%'}} />
              </TouchableWithoutFeedback>
            </View>
          )}
        </View>
      </Animated.View> */
}

export default CalendarView;
