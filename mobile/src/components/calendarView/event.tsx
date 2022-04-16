import dayjs from 'dayjs';
import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {
  CalendarEventFragment,
  GetAllEventsDocument,
  useDeleteEventMutation,
} from '../../generated/graphql';
import SlidingView from '../slidingView';

interface EventProps {
  event: CalendarEventFragment;
}

const Event: React.FC<EventProps> = ({event}) => {
  const [deleteEvent] = useDeleteEventMutation();
  const frontView = (
    <View style={styles.frontViewContainer}>
      <Text>{event.name}</Text>
      <Text>{dayjs(event.startDate).format('HH:mm')}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <SlidingView
        frontView={frontView}
        backView={[
          <TouchableOpacity
            onPress={() => {
              deleteEvent({
                variables: {id: event.id},
                refetchQueries: [GetAllEventsDocument],
              });
            }}>
            <View style={styles.backViewContainer}>
              <Image
                source={require('../../../assets/Delete.png')}
                style={styles.image}
              />
            </View>
          </TouchableOpacity>,
        ]}
        backViewWidth={70}
        numberOfBackElements={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'stretch',
    height: 25,
    width: 25,
  },
  backViewContainer: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  frontViewContainer: {
    backgroundColor: '#eee',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Event;