import dayjs from 'dayjs';
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Pressable,
  TouchableHighlight,
} from 'react-native';
import {CalendarEventFragment} from '../../generated/graphql';
import {useDeleteEvent} from '../../mutationHooks/calendarEvent/deleteEvent';
import {useCreateTask} from '../../mutationHooks/task/createTask';
import {BasicText} from '../basicViews/BasicText';
import EditDateModal from '../editDateWindow';
import {Menu} from '../menu';
import {MenuItem} from '../menu/MenuItem';
import SlidingView from '../slidingView';
import {v4 as uuidv4} from 'uuid';
import {Popup} from '../popup';
import {useNavigation} from '@react-navigation/native';
import {CalendarNavigationProp} from '../../utils/types';
import {BasicCard} from '../basicViews/BasicCard';
import {useTheme} from '../../contexts/ThemeContext';

interface EventProps {
  event: CalendarEventFragment;
}

const Event: React.FC<EventProps> = ({event}) => {
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
      <View
        style={[
          styles.frontViewContainer,
          {backgroundColor: theme.colors.accentBackground},
        ]}>
        <BasicText>{event.name}</BasicText>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <BasicText color="textSecondary" style={{marginRight: 5}}>
            {dayjs(event.startDate).format('HH:mm')}
          </BasicText>
          <Popup
            trigger={
              <Pressable>
                <Image
                  source={require('../../../assets/Options.png')}
                  style={styles.options}
                />
              </Pressable>
            }>
            <Menu>
              <MenuItem
                text={'Add time to study'}
                onPress={() => {
                  setStudyTimeModalVisible(true);
                }}
              />
            </Menu>
          </Popup>
        </View>
      </View>
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
        isVisible={studyTimeModalVisible}
        onClose={() => {
          setStudyTimeModalVisible(false);
        }}
        onSubmit={date => {
          setStudyTimeModalVisible(false);
          addTask({
            id: uuidv4(),
            name: `Study for ${event?.name}`,
            subjectId: event.subject?.id,
            dueDate: event?.startDate,
            doDate: date.toDate(),
          });
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
    marginHorizontal: 10,
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
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  options: {
    resizeMode: 'stretch',
    height: 15,
    width: 15,
  },
});

export default Event;
