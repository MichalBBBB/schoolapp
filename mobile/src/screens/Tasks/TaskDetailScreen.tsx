import {NativeStackScreenProps} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
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
import BackButton from '../../components/backButton';
import BasicInputWindow from '../../components/basicInputWindow';
import {BasicButton} from '../../components/basicViews/BasicButton';
import EditDateModal from '../../components/editDateWindow';
import Subtask from '../../components/subtask';
import {calendarConfigWithoutTime} from '../../components/task';
import {
  GetAllTasksDocument,
  useCreateSubtaskMutation,
  useEditTaskMutation,
  useGetAllTasksQuery,
} from '../../generated/graphql';
import {TaskStackParamList} from '../../routes/TaskStack';

const TaskDetailScreen: React.FC<
  NativeStackScreenProps<TaskStackParamList, 'TaskDetailScreen'>
> = ({navigation, route}) => {
  const {data: Tasks} = useGetAllTasksQuery();
  const task = Tasks?.getAllTasks.find(
    item => item.id == route.params.task.id,
  )!;
  const [addSubtask] = useCreateSubtaskMutation();
  const [name, setName] = useState(task.name);
  const [text, setText] = useState(task.text);
  const [dueDate, setDueDate] = useState<dayjs.Dayjs | null>(
    task.dueDate ? dayjs(task.dueDate) : null,
  );
  const [doDate, setDoDate] = useState<dayjs.Dayjs | null>(
    task.doDate ? dayjs(task.doDate) : null,
  );
  const [edited, setEdited] = useState(false);
  const [editTask] = useEditTaskMutation();
  const [editDueDateModalIsVisible, setEditDueDateModalIsVisible] =
    useState(false);
  const [editDoDateModalIsVisible, setEditDoDateModalIsVisible] =
    useState(false);
  const [addSubtaskModalIsVisible, setAddSubtaskModalIsVisible] =
    useState(false);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setAddSubtaskModalIsVisible(true);
          }}>
          <Image
            source={require('../../../assets/Plus.png')}
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
                dueDate: task.dueDate,
                doDate: task.doDate,
              },
            });
            navigation.goBack();
          }}
        />
      ),
    });
  });

  return (
    <>
      <View style={styles.container}>
        <View style={styles.actionContainer}>
          <BasicButton
            onPress={() => {
              setEditDueDateModalIsVisible(true);
            }}
            spacing="s"
            borderRadius={10}
            style={styles.action}>
            <Text>
              {task.dueDate
                ? `Due: ${dayjs(task.dueDate).calendar(
                    null,
                    calendarConfigWithoutTime,
                  )}`
                : 'Due date'}
            </Text>
          </BasicButton>
          <BasicButton
            onPress={() => {
              setEditDoDateModalIsVisible(true);
            }}
            spacing="s"
            borderRadius={10}>
            <Text>
              {task.doDate
                ? `Do: ${dayjs(task.doDate).calendar(
                    null,
                    calendarConfigWithoutTime,
                  )}`
                : 'Schedule'}
            </Text>
          </BasicButton>
        </View>
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
      <EditDateModal
        subject={task.subject}
        onClose={() => {
          setEditDueDateModalIsVisible(false);
        }}
        onSubmit={date => {
          setDueDate(date);
          editTask({
            variables: {
              id: task.id,
              name,
              text,
              dueDate: date.toDate(),
              doDate: task.doDate,
            },
          });
          setEditDueDateModalIsVisible(false);
        }}
        isVisible={editDueDateModalIsVisible}
      />
      <EditDateModal
        onClose={() => {
          setEditDoDateModalIsVisible(false);
        }}
        onSubmit={date => {
          setDoDate(date);
          setEditDoDateModalIsVisible(false);
          editTask({
            variables: {
              id: task.id,
              name,
              text,
              dueDate: task.dueDate,
              doDate: date.toDate(),
            },
          });
        }}
        isVisible={editDoDateModalIsVisible}
      />
      <BasicInputWindow
        visible={addSubtaskModalIsVisible}
        onClose={() => {
          setAddSubtaskModalIsVisible(false);
        }}
        onSubmit={() => {
          addSubtask({
            variables: {name, taskId: task.id},
            refetchQueries: [GetAllTasksDocument],
          });
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  action: {
    marginRight: 5,
  },
  actionContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
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
    paddingHorizontal: 20,
  },
  plusButton: {
    resizeMode: 'stretch',
    height: 30,
    width: 30,
  },
});

export default TaskDetailScreen;
