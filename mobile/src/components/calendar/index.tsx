import dayjs from 'dayjs';
import React, {createRef, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import Month from './month';
import relativeTime from 'dayjs/plugin/relativeTime';
import {useNavigation} from '@react-navigation/native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export const calendarWidth = Dimensions.get('screen').width;
export const calendarHeight = 210;

export const createMatrix = (year: number, month: number) => {
  const matrix: dayjs.Dayjs[][] = [];
  const date = dayjs(new Date(year, month - 1, 1));

  const firstDay = date.startOf('month').get('day');

  let day = date.subtract(firstDay, 'day');

  for (var row = 0; row < 6; row++) {
    matrix.push([]);
    for (var col = 0; col < 7; col++) {
      matrix[row].push(day);
      day = day.add(1, 'day');
    }
  }
  return matrix;
};

dayjs.extend(relativeTime);

const weekDays = ['s', 'm', 't', 'w', 't', 'f', 's'];

interface calendarProps {
  screenHeight: number;
}

const Calendar: React.FC<calendarProps> = ({screenHeight}) => {
  const [month, setMonth] = useState(dayjs());
  const [months, setMonths] = useState<Array<dayjs.Dayjs | string>>([]);
  const [index, setIndex] = useState(50);
  const [selectedDay, setSelectedDay] = useState(dayjs());
  const navigation = useNavigation();
  const [isWeekView, setIsWeekView] = useState(false);
  const y = useSharedValue(0);

  console.log(screenHeight);

  useEffect(() => {
    console.log(selectedDay);
    let monthsCopy = [];
    for (var i = 0; i < 101; i++) {
      let newMonth;
      if (i >= 49 && i <= 51) {
        newMonth = month.subtract(50 - i, 'month');
        console.log(newMonth.format('YYYY M'));
      } else {
        newMonth = month.subtract(50 - i, 'month').format('YYYY M');
      }
      monthsCopy.push(newMonth);
    }
    setMonths(monthsCopy);
  }, []);

  const flatListRef = createRef<FlatList>();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: screenHeight - calendarHeight - y.value,
    };
  });

  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      if (e.translationY < 0) {
        y.value = e.translationY;
      }
    })
    .onEnd(e => {
      y.value = withTiming(0);
    });

  const renderItem = ({item}: {item: dayjs.Dayjs | string}) => {
    // console.log(item);
    return (
      <Month
        month={item}
        selectedDay={selectedDay}
        onDayPress={date => {
          setSelectedDay(date);
          if (date.month() !== (months[index] as dayjs.Dayjs).month()) {
            flatListRef.current?.scrollToIndex({
              index: date.isBefore(months[index]) ? index - 1 : index + 1,
            });
          }
        }}
      />
    );
  };

  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        {weekDays.map((item, index) => (
          <View
            style={{height: 30, width: 20, alignItems: 'center'}}
            key={index}>
            <Text style={{color: 'grey'}}>{item}</Text>
          </View>
        ))}
      </View>
      <View style={{position: 'absolute', marginTop: 30}}>
        <FlatList
          data={months}
          renderItem={renderItem}
          getItemLayout={(item, index) => ({
            length: calendarWidth,
            offset: calendarWidth * index,
            index: index,
          })}
          horizontal={true}
          initialScrollIndex={50}
          snapToOffsets={months.map((item, index) => index * calendarWidth)}
          decelerationRate={'fast'}
          removeClippedSubviews={true}
          onMomentumScrollEnd={item => {
            const newIndex = item.nativeEvent.contentOffset.x / calendarWidth;
            const monthsCopy = [...months];
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
              }
            }
            setIndex(newIndex);
            setMonths(monthsCopy);
            navigation.setOptions({
              title: (months[newIndex] as dayjs.Dayjs).format('MMMM'),
            });
          }}
          ref={flatListRef}
          extraData={index}
        />
      </View>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[animatedStyle]}>
          <ScrollView
            scrollEnabled={isWeekView}
            style={{flex: 1, backgroundColor: 'white'}}
            onScroll={e => {
              console.log(e.nativeEvent.contentOffset);
            }}
            scrollEventThrottle={100}>
            <View
              style={{
                backgroundColor: 'black',
                height: 20,
                width: 100,
                marginBottom: 100,
              }}></View>
            <View
              style={{
                backgroundColor: 'black',
                height: 20,
                width: 100,
                marginBottom: 100,
              }}></View>
            <View
              style={{
                backgroundColor: 'black',
                height: 20,
                width: 100,
                marginBottom: 100,
              }}></View>
            <View
              style={{
                backgroundColor: 'black',
                height: 20,
                width: 100,
                marginBottom: 100,
              }}></View>
            <View
              style={{
                backgroundColor: 'black',
                height: 20,
                width: 100,
                marginBottom: 100,
              }}></View>
          </ScrollView>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default Calendar;
