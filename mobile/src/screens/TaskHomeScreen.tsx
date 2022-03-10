import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {createRef, useLayoutEffect, useRef, useState} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import AddButton from '../components/addButton';
import AddSubjectWindow from '../components/addSubjectWindow';
import AddTaskWindow from '../components/addTaskWindow';
import EditDateWindow from '../components/editDateWindow';
import Task from '../components/task';
import {useGetAllTasksQuery} from '../generated/graphql';
import {TaskStackParamList} from '../routes/TaskStack';

const TaskHomeScreen: React.FC<
  NativeStackScreenProps<TaskStackParamList, 'TaskHomeScreen'>
> = ({navigation}) => {
  const {data} = useGetAllTasksQuery();
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [addSubjectOpen, setAddSubjectOpen] = useState(false);
  const [editDateOpen, setEditDateOpen] = useState(false);
  return (
    <View style={{flex: 1}}>
      <FlatList
        data={data?.getAllTasks}
        renderItem={({item, index}) => <Task task={item} />}
        //ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <View style={{position: 'absolute', right: 0, bottom: 0, margin: 20}}>
        <AddButton
          onPress={() => {
            setAddTaskOpen(true);
          }}
        />
      </View>
      {addTaskOpen && (
        <AddTaskWindow
          onClose={() => {
            setAddTaskOpen(false);
          }}
          onAddSubject={() => {
            setAddTaskOpen(false);
            setAddSubjectOpen(true);
          }}
          onEditDate={() => {
            setAddTaskOpen(false);
            setEditDateOpen(true);
          }}
        />
      )}
      {addSubjectOpen && (
        <AddSubjectWindow
          onClose={() => {
            setAddSubjectOpen(false);
            setAddTaskOpen(true);
          }}
        />
      )}
      {editDateOpen && <EditDateWindow />}
    </View>
  );
};

const styles = StyleSheet.create({
  task: {
    padding: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 10,
  },
  plusButton: {
    resizeMode: 'stretch',
    height: 30,
    width: 30,
  },
});

export default TaskHomeScreen;
