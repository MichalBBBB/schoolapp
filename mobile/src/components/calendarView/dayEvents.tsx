import dayjs from 'dayjs';
import React, {useEffect} from 'react';
import {View, FlatList} from 'react-native';
import {useEvent} from 'react-native-reanimated';
import {useGetAllEventsQuery} from '../../generated/graphql';
import Event from './event';

interface DayEventsProps {
  date: dayjs.Dayjs;
}

const DayEvents: React.FC<DayEventsProps> = ({date}) => {
  const {data} = useGetAllEventsQuery();

  useEffect(() => {
    console.log(data);
  });

  return (
    <View>
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
