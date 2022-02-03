import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import BackButton from '../components/backButton';
import Subtask from '../components/subtask';
import {useEditTaskMutation, useGetAllTasksQuery} from '../generated/graphql';
import {TaskStackParamList} from '../routes/TaskStack';

const TaskDetailScreen: React.FC<
  NativeStackScreenProps<TaskStackParamList, 'TaskDetailScreen'>
> = ({navigation, route}) => {
  const {data: Tasks} = useGetAllTasksQuery();
  const task = Tasks?.getAllTasks.find(
    item => item.id == route.params.task.id,
  )!;
  const [name, setName] = useState(task.name);
  const [text, setText] = useState(task.text);
  const [edited, setEdited] = useState(false);
  const [editTask] = useEditTaskMutation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AddSubtaskScreen', {
              taskId: task.id,
            });
          }}>
          <Image
            source={require('../../assets/Plus.png')}
            style={styles.plusButton}
          />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <BackButton
          onPress={() => {
            editTask({
              variables: {
                id: task.id,
                name,
                text,
              },
            });
            navigation.goBack();
          }}
        />
      ),
    });
  });

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={text => {
          setEdited(true);
          setName(text);
        }}
        defaultValue={task.name}
        style={styles.name}
      />
      <TextInput
        multiline={true}
        onChangeText={setText}
        defaultValue={task.text || ''}
      />
      <FlatList
        data={task.subtasks}
        renderItem={({item, index}) => <Subtask subtask={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
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
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    padding: 10,
  },
  plusButton: {
    resizeMode: 'stretch',
    height: 30,
    width: 30,
  },
});

export default TaskDetailScreen;
