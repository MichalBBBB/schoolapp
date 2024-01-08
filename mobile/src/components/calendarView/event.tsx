import dayjs from 'dayjs';
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  LayoutAnimation,
} from 'react-native';
import {
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {CalendarEventFragment} from '../../generated/graphql';
import {useDeleteEvent} from '../../mutationHooks/calendarEvent/deleteEvent';
import {useCreateTask} from '../../mutationHooks/task/createTask';
import {BasicText} from '../basicViews/BasicText';
import EditDateModal from '../modals/editDateWindow';
import SlidingView from '../slidingView';
import {v4 as uuidv4} from 'uuid';
import {useNavigation} from '@react-navigation/native';
import {CalendarNavigationProp} from '../../utils/types';
import {BasicCard} from '../basicViews/BasicCard';
import {useTheme} from '../../contexts/ThemeContext';
import {BasicIcon} from '../basicViews/BasicIcon';

interface EventProps {
  event: CalendarEventFragment;
  height?: number;
  variant?: 'list' | 'calendar';
}

const Event: React.FC<EventProps> = ({event, height, variant = 'list'}) => {
  const [deleteEvent] = useDeleteEvent();
  const [addTask] = useCreateTask();

  const navigation = useNavigation<CalendarNavigationProp>();

  const [theme] = useTheme();

  const [studyTimeModalVisible, setStudyTimeModalVisible] = useState(false);

  const frontView = (
    <TouchableHighlight
      onPress={() => {
        navigation.navigate('EventDetailScreen', {event});
      }}>
      <BasicCard
        backgroundColor="accentBackground1"
        borderRadius={0}
        style={{
          height,
          padding:
            variant == 'calendar' ? (height && height >= 40 ? 12 : 0) : 12,
          paddingHorizontal: 10,
          justifyContent: height && height >= 40 ? 'space-between' : 'center',
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <BasicText style={{marginRight: 5}} numberOfLines={1}>
            {event.name}
          </BasicText>
          {variant == 'list' && (
            <BasicText color="textSecondary">
              {`${dayjs(event.startDate).format('HH:mm')} - ${dayjs(
                event.endDate,
              ).format('HH:mm')}`}
            </BasicText>
          )}
        </View>
        {variant == 'calendar' && height && height >= 40 && (
          <BasicText color="textSecondary" style={{marginRight: 8}}>
            {`${dayjs(event.startDate).format('HH:mm')} - ${dayjs(
              event.endDate,
            ).format('HH:mm')}`}
          </BasicText>
        )}
      </BasicCard>
    </TouchableHighlight>
  );

  return (
    <>
      <View style={styles.container}>
        <SlidingView
          frontView={frontView}
          backView={[
            <TouchableOpacity
              onPress={() => {
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut,
                );
                deleteEvent({id: event.id});
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
      <EditDateModal
        clearButton={false}
        isVisible={studyTimeModalVisible}
        onClose={() => {
          setStudyTimeModalVisible(false);
        }}
        onSubmit={({date}) => {
          setStudyTimeModalVisible(false);
          addTask({
            id: uuidv4(),
            name: `Study for ${event?.name}`,
            subjectId: event.subject?.id,
            dueDate: event?.startDate,
            doDate: date!.toDate(),
          });
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'stretch',
    height: 25,
    width: 25,
    tintColor: 'white',
  },
  backViewContainer: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  frontViewContainer: {},
  options: {
    resizeMode: 'stretch',
    height: 20,
    width: 20,
  },
});

export default Event;
