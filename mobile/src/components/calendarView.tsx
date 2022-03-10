import dayjs from 'dayjs';
import React, {createRef, useEffect, useState} from 'react';
import {Dimensions, FlatList, Text, TouchableOpacity, View} from 'react-native';
import relativeTime from 'dayjs/plugin/relativeTime';
import {useNavigation} from '@react-navigation/native';
import {
  Gesture,
  GestureDetector,
  ScrollView,
} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import WeekView from './calendar/weekView';
import Calendar from './calendar';
import WeekDays from './calendar/weekDays';

// constants
export const calendarWidth = Dimensions.get('screen').width;
export const calendarHeight = 204;
export const weekHeight = 34;
export const weekHeaderHeight = 30;
const pastScrollRange = 10;
const futureScrollRange = 50;

dayjs.extend(relativeTime);

interface calendarProps {
  screenHeight: number;
}

const CalendarView: React.FC<calendarProps> = ({screenHeight}) => {
  const [selectedDay, setSelectedDay] = useState(dayjs());
  const [isWeekView, setIsWeekView] = useState(false);
  const [isMonthView, setIsMonthView] = useState(true);
  const y = useSharedValue(0);
  const weekRow = useSharedValue(0);
  const scrollViewRef = createRef<ScrollView>();

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
      height: screenHeight - (calendarHeight + weekHeaderHeight) - y.value,
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
    };
  });

  // pan gesture of data for a specific day
  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      // if full month is visible, don't allow to move down and neither too far up
      if (
        isMonthView &&
        e.translationY < 0 &&
        e.translationY > -(calendarHeight - weekHeight)
      ) {
        y.value = e.translationY;
        // if only week is visible, don't allow to move up and neither too far down
      } else if (
        !isMonthView &&
        e.translationY > 0 &&
        e.translationY < calendarHeight - weekHeight
      ) {
        // change the offset relative to the position when only a week is visible
        y.value = e.translationY - (calendarHeight - weekHeight);
      }
    })
    .onEnd(e => {
      // if it is closer to the week view, go to the week view
      if (y.value < -(calendarHeight - weekHeight) / 2) {
        y.value = withTiming(-(calendarHeight - weekHeight), undefined, () => {
          runOnJS(setIsWeekView)(true);
          runOnJS(setIsMonthView)(false);
        });
      } else {
        y.value = withTiming(0, undefined, () => {
          runOnJS(setIsWeekView)(false);
          runOnJS(setIsMonthView)(true);
        });
      }
    })
    .simultaneousWithExternalGesture(scrollViewRef);

  const onDayPress = (date: dayjs.Dayjs) => {
    setSelectedDay(date);
    weekRow.value = findRowOfDate(date);
  };

  const monthView = (
    <Animated.View
      style={[
        {
          position: 'absolute',
          marginTop: weekHeaderHeight,
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
      />
    </Animated.View>
  );

  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <WeekDays weekHeaderHeight={weekHeaderHeight} />
      {isWeekView ? (
        <View
          style={[
            {
              position: 'absolute',
              marginTop: weekHeaderHeight,
            },
          ]}>
          <WeekView
            calendarWidth={calendarWidth}
            week={selectedDay}
            onDayPress={onDayPress}
            selectedDay={selectedDay}
          />
        </View>
      ) : (
        monthView
      )}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[animatedStyle]}>
          <ScrollView
            ref={scrollViewRef}
            scrollEnabled={isWeekView}
            style={{flex: 1, backgroundColor: 'white', paddingTop: 5}}
            onScroll={e => {
              // if scrolling up, disable weekView
              if (e.nativeEvent.contentOffset.y < 0) {
                setIsWeekView(false);
              }
            }}
            scrollEventThrottle={100}>
            {[0, 0, 0, 0, 0, 0].map(() => (
              <View
                style={{
                  backgroundColor: '#DDD',
                  padding: 20,
                  marginBottom: 10,
                  marginHorizontal: 10,
                  borderRadius: 15,
                }}>
                <Text>Event</Text>
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default CalendarView;
