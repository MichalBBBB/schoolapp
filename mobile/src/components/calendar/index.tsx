import dayjs from 'dayjs';
import React, {createRef, useEffect, useState} from 'react';
import {Dimensions, FlatList, Text, TouchableOpacity, View} from 'react-native';
import Month from './month';
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
import WeekView from './weekView';

// constants
export const calendarWidth = Dimensions.get('screen').width;
export const calendarHeight = 204;
export const weekHeight = 34;
export const weekHeaderHeight = 30;
const pastScrollRange = 10;
const futureScrollRange = 50;

dayjs.extend(relativeTime);

const weekDays = ['s', 'm', 't', 'w', 't', 'f', 's'];

interface calendarProps {
  screenHeight: number;
}

const Calendar: React.FC<calendarProps> = ({screenHeight}) => {
  const [month, setMonth] = useState(dayjs());
  const [months, setMonths] = useState<Array<dayjs.Dayjs | string>>([]);
  const [index, setIndex] = useState(pastScrollRange);
  const [selectedDay, setSelectedDay] = useState(dayjs());
  const navigation = useNavigation();
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
    weekRow.value = findRowOfDate(selectedDay);
  }, []);

  const flatListRef = createRef<FlatList>();

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
    // if pressed day is in a different month than active, scroll to it
    if (date.month() !== (months[index] as dayjs.Dayjs).month()) {
      flatListRef.current?.scrollToIndex({
        index: date.isBefore(months[index]) ? index - 1 : index + 1,
      });
    }
    weekRow.value = findRowOfDate(date);
  };

  const renderItem = ({item}: {item: dayjs.Dayjs | string}) => {
    // console.log(item);
    return (
      <Month
        month={item}
        selectedDay={selectedDay}
        onDayPress={date => {
          onDayPress(date);
        }}
      />
    );
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
      <FlatList
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
              const stringDate = (monthsCopy[i] as dayjs.Dayjs).format(
                'YYYY M',
              );
              monthsCopy[i] = stringDate;
            }
          }
          setIndex(newIndex);
          setMonths(monthsCopy);
          // change header title to current month
          navigation.setOptions({
            title: (monthsCopy[newIndex] as dayjs.Dayjs).format('MMMM'),
          });
        }}
        ref={flatListRef}
        extraData={index}
      />
    </Animated.View>
  );

  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          backgroundColor: 'white',
          alignItems: 'center',
          zIndex: 10,
        }}>
        {weekDays.map((item, index) => (
          <View
            style={{
              height: weekHeaderHeight,
              width: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            key={index}>
            <Text style={{color: 'grey'}}>{item}</Text>
          </View>
        ))}
      </View>
      {isWeekView ? (
        <View
          style={[
            {
              position: 'absolute',
              marginTop: weekHeaderHeight,
            },
          ]}>
          <WeekView
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

export default Calendar;
