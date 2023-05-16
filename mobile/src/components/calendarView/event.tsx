import dayjs from 'dayjs';
import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, Pressable} from 'react-native';
import {
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {CalendarEventFragment} from '../../generated/graphql';
import {useDeleteEvent} from '../../mutationHooks/calendarEvent/deleteEvent';
import {useCreateTask} from '../../mutationHooks/task/createTask';
import {BasicText} from '../basicViews/BasicText';
import EditDateModal from '../modals/editDateWindow';
import {Menu} from '../menu';
import {MenuItem} from '../menu/MenuItem';
import SlidingView from '../slidingView';
import {v4 as uuidv4} from 'uuid';
import {Popup} from '../popup';
import {useNavigation} from '@react-navigation/native';
import {CalendarNavigationProp} from '../../types/navigationTypes';
import {BasicCard} from '../basicViews/BasicCard';
import {useTheme} from '../../contexts/ThemeContext';
import {BasicIcon} from '../basicViews/BasicIcon';

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
          {backgroundColor: theme.colors.accentBackground1},
        ]}>
        <BasicText>{event.name}</BasicText>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <BasicText color="textSecondary" style={{marginRight: 8}}>
            {dayjs(event.startDate).format('HH:mm')}
          </BasicText>
          <Popup
            trigger={
              <TouchableOpacity>
                <BasicIcon
                  source={require('../../../assets/Options.png')}
                  style={styles.options}
                />
              </TouchableOpacity>
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
        clearButton={false}
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
            doDate: date!.toDate(),
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
  frontViewContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  options: {
    resizeMode: 'stretch',
    height: 20,
    width: 20,
  },
});

export default Event;
