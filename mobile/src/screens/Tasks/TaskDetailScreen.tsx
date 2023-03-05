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
import {BasicText} from '../../components/basicViews/BasicText';
import {BasicTextInput} from '../../components/basicViews/BasicTextInput';
import EditDateModal from '../../components/editDateWindow';
import Subtask from '../../components/subtask';
import {calendarConfigWithoutTime} from '../../components/task';
import {
  GetAllTasksDocument,
  RemindersInput,
  useCreateSubtaskMutation,
  useEditTaskMutation,
  useGetAllTasksQuery,
} from '../../generated/graphql';
import {TaskStackParamList} from '../../routes/TaskStack';
import {v4 as uuidv4} from 'uuid';
import {useCreateSubtask} from '../../mutationHooks/task/createSubtask';
import {useEditTask} from '../../mutationHooks/task/editTask';
import {setRemindersFromApollo} from '../../utils/reminderUtils';
import {useApolloClient} from '@apollo/client';
import SelectSubjectWindow from '../../components/selectSubject';
import {Popup} from '../../components/popup';
import {SelectSubjectPopup} from '../../components/selectSubject/selectSubjectPopup';

const TaskDetailScreen: React.FC<
  NativeStackScreenProps<TaskStackParamList, 'TaskDetailScreen'>
> = ({navigation, route}) => {
  const {data: Tasks} = useGetAllTasksQuery();
  const task = Tasks?.getAllTasks.find(
    item => item.id == route.params.task.id,
  )!;
  const [addSubtask] = useCreateSubtask();

  const client = useApolloClient();

  const [name, setName] = useState(task.name);
  const [text, setText] = useState(task.text);
  const [dueDate, setDueDate] = useState<dayjs.Dayjs | null>(
    task.dueDate ? dayjs(task.dueDate) : null,
  );
  const [edited, setEdited] = useState(false);
  const [editTask] = useEditTask();
  const [editDueDateModalIsVisible, setEditDueDateModalIsVisible] =
    useState(false);
  const [editDoDateModalIsVisible, setEditDoDateModalIsVisible] =
    useState(false);
  const [addSubtaskModalIsVisible, setAddSubtaskModalIsVisible] =
    useState(false);
  const [selectSubjectModalIsVisible, setSelectSubjectModalIsVisible] =
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
              id: task.id,
              name,
              text,
              dueDate: task.dueDate,
              doDate: task.doDate,
              subjectId: task.subject?.id,
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
            backgroundColor="accentBackground"
            onPress={() => {
              setEditDueDateModalIsVisible(true);
            }}
            spacing="s"
            borderRadius={10}
            style={styles.action}>
            <BasicText>
              {task.dueDate
                ? `Due: ${dayjs(task.dueDate).calendar(
                    null,
                    calendarConfigWithoutTime,
                  )}`
                : 'Due date'}
            </BasicText>
          </BasicButton>
          <BasicButton
            style={styles.action}
            backgroundColor="accentBackground"
            onPress={() => {
              setEditDoDateModalIsVisible(true);
            }}
            spacing="s"
            borderRadius={10}>
            <BasicText>
              {task.doDate
                ? `Do: ${dayjs(task.doDate).calendar(
                    null,
                    calendarConfigWithoutTime,
                  )}`
                : 'Schedule'}
            </BasicText>
          </BasicButton>
          <SelectSubjectPopup
            trigger={
              <BasicButton
                backgroundColor="accentBackground"
                spacing="s"
                borderRadius={10}>
                <BasicText>
                  {task.subject ? task.subject.name : 'Subject'}
                </BasicText>
              </BasicButton>
            }
            onSubmit={subject => {
              editTask({
                id: task.id,
                name,
                text,
                dueDate: task.dueDate,
                doDate: task.doDate,
                subjectId: subject?.id,
              });
              setSelectSubjectModalIsVisible(false);
            }}
          />
        </View>
        <BasicTextInput
          variant="unstyled"
          spacing="none"
          textVariant="heading"
          onChangeText={text => {
            setEdited(true);
            setName(text);
          }}
          defaultValue={task.name}
        />
        <BasicTextInput
          variant="unstyled"
          multiline={true}
          onChangeText={setText}
          defaultValue={task.text || ''}
        />
        <FlatList
          contentContainerStyle={{borderRadius: 15, overflow: 'hidden'}}
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
            id: task.id,
            name,
            text,
            dueDate: date.toDate(),
            doDate: task.doDate,
            subjectId: task.subject?.id,
          });
          setEditDueDateModalIsVisible(false);
        }}
        isVisible={editDueDateModalIsVisible}
      />
      <EditDateModal
        initialDate={dayjs(task.doDate)}
        initialReminderTimes={task.reminders.map(item => item.minutesBefore)}
        reminders
        onClose={() => {
          setEditDoDateModalIsVisible(false);
        }}
        onSubmit={async (date, reminderTimes) => {
          let reminders: RemindersInput[] | undefined;
          if (reminderTimes) {
            reminders = reminderTimes.map(item => {
              const id = uuidv4();
              return {
                id,
                title: task.name,
                minutesBefore: item,
                date: dayjs(task.doDate).subtract(item, 'minute').toDate(),
              };
            });
          }
          setEditDoDateModalIsVisible(false);
          await editTask({
            id: task.id,
            name,
            text,
            dueDate: task.dueDate,
            doDate: date.toDate(),
            reminders,
            subjectId: task.subject?.id,
          });
          setRemindersFromApollo(client);
        }}
        isVisible={editDoDateModalIsVisible}
      />
      <BasicInputWindow
        visible={addSubtaskModalIsVisible}
        onClose={() => {
          setAddSubtaskModalIsVisible(false);
        }}
        onSubmit={value => {
          addSubtask({id: uuidv4(), name: value, taskId: task.id});
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
  separator: {
    height: 0.5,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
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
