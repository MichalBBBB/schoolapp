import dayjs from 'dayjs';
import React, {useEffect} from 'react';
import {View, FlatList, Text} from 'react-native';
import {useEvent} from 'react-native-reanimated';
import {
  useGetAllEventsQuery,
  useGetAllLessonsQuery,
} from '../../generated/graphql';
import {BasicCard} from '../basicViews/BasicCard';
import Event from './event';
import weekday from 'dayjs/plugin/weekday';
import {WEEK_DAY_NUMBERS} from '../../types/weekDays';

interface DayEventsProps {
  date: dayjs.Dayjs;
}

const DayEvents: React.FC<DayEventsProps> = ({date}) => {
  const {data} = useGetAllEventsQuery();
  const {data: lessons} = useGetAllLessonsQuery();

  useEffect(() => {
    console.log(data);
  });

  return (
    <View>
      <FlatList
        data={lessons?.getAllLessons.filter(item => {
          return (
            date.day() ==
            (WEEK_DAY_NUMBERS[
              item.dayOfTheWeek as keyof typeof WEEK_DAY_NUMBERS
            ] as number)
          );
        })}
        renderItem={({item, index}) => (
          <BasicCard>
            <Text>{item.subject.name}</Text>
            <Text>
              {item.lessonTime.startTime} - {item.lessonTime.endTime}
            </Text>
          </BasicCard>
        )}
        scrollEnabled={false}
      />
      <FlatList
        data={data?.getAllEvents.filter(item =>
          dayjs(item.startDate).isSame(date, 'day'),
        )}
        renderItem={({item, index}) => <Event event={item} />}
        scrollEnabled={false}
        disableVirtualization={true}
      />
    </View>
  );
};

export default DayEvents;
