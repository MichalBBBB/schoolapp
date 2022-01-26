import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useLayoutEffect} from 'react';
import {Button, FlatList, StyleSheet, View} from 'react-native';
import Subtask from '../components/subtask';
import Task from '../components/task';
import {useGetAllTasksQuery} from '../generated/graphql';
import {TaskStackParamList} from '../routes/TaskStack';

const TaskDetailScreen: React.FC<
  NativeStackScreenProps<TaskStackParamList, 'TaskDetailScreen'>
> = ({navigation, route}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="add"
          onPress={() => {
            navigation.navigate('AddSubtaskScreen', {
              taskId: route.params.task.id,
            });
          }}
        />
      ),
    });
  });
  return (
    <FlatList
      data={route.params.task.subtasks}
      renderItem={({item, index}) => <Subtask subtask={item} />}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  task: {
    padding: 10,
  },
  separator: {
    height: 0.5,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
  },
});

export default TaskDetailScreen;
