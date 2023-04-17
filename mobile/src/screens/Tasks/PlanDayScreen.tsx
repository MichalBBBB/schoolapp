import React, {useEffect} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import {useState} from 'react';
import {FlatList, Image, SectionList, StyleSheet, View} from 'react-native';
import {BasicButton} from '../../components/basicViews/BasicButton';
import {BasicCard} from '../../components/basicViews/BasicCard';
import {BasicText} from '../../components/basicViews/BasicText';
import Task, {calendarConfigWithoutTime} from '../../components/listItems/task';
import {TaskFragment, useGetAllTasksQuery} from '../../generated/graphql';
import {BasicIcon} from '../../components/basicViews/BasicIcon';
import {TaskStackScreenProps} from '../../utils/types';
import AddButton from '../../components/addButton';
import {BasicTextInput} from '../../components/basicViews/BasicTextInput';

export const PlanDayScreen: React.FC<
  TaskStackScreenProps<'PlanDayScreen'>
> = () => {
  const [day, setDay] = useState(dayjs());
  const {data} = useGetAllTasksQuery();

  const unDoneTasks = data?.getAllTasks.filter(item => !item.done);
  const todayTasks = unDoneTasks?.filter(item => {
    if (item.doDate) {
      return dayjs(item.doDate).isSame(day, 'day');
    }
  });
  const unassignedTasks = unDoneTasks
    ?.filter(item => !item.doDate)
    .sort((a, b) => {
      return dayjs(a.dueDate).diff(b.dueDate, 'minute');
    });
  return (
    <View style={{padding: 10, flex: 1}}>
      <FlatList
        ListHeaderComponent={
          <BasicCard backgroundColor="accentBackground1">
            <BasicTextInput />
            <View style={styles.topContainer}>
              <BasicButton
                variant="unstyled"
                onPress={() => {
                  setDay(day.subtract(1, 'day'));
                }}>
                <BasicIcon
                  style={styles.arrow}
                  source={require('../../../assets/Chevron-left.png')}
                />
              </BasicButton>
              <BasicText>
                {day.calendar(null, calendarConfigWithoutTime)}
              </BasicText>
              <BasicButton
                variant="unstyled"
                onPress={() => {
                  setDay(day.add(1, 'day'));
                }}>
                <BasicIcon
                  style={styles.arrow}
                  source={require('../../../assets/Chevron-right.png')}
                />
              </BasicButton>
            </View>
            {!todayTasks || todayTasks?.length == 0 ? (
              <View
                style={{
                  height: 30,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <BasicText textVariant="button">No tasks planned</BasicText>
              </View>
            ) : (
              todayTasks?.map((item, index) => (
                <Task
                  key={index}
                  backgroundColor="accentBackground1"
                  task={item}
                  planning
                  planningDay={day}
                />
              ))
            )}
          </BasicCard>
        }
        data={unassignedTasks}
        renderItem={({item}) => <Task task={item} planning planningDay={day} />}
      />
      <View style={{position: 'absolute', right: 0, bottom: 0, margin: 20}}>
        <AddButton onPress={() => {}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  arrow: {
    height: 20,
    width: 20,
  },
});
