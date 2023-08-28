import dayjs from 'dayjs';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Keyboard,
  LayoutAnimation,
} from 'react-native';
import BackButton from '../../components/backButton';
import BasicInputWindow from '../../components/modals/basicInputWindow';
import {BasicButton} from '../../components/basicViews/BasicButton';
import {BasicText} from '../../components/basicViews/BasicText';
import {BasicTextInput} from '../../components/basicViews/BasicTextInput';
import EditDateModal from '../../components/modals/editDateWindow';
import Subtask from '../../components/listItems/subtask';
import {calendarConfigWithoutTime} from '../../components/listItems/task';
import {RemindersInput, useGetAllTasksQuery} from '../../generated/graphql';
import {v4 as uuidv4} from 'uuid';
import {useCreateSubtask} from '../../mutationHooks/task/createSubtask';
import {useEditTask} from '../../mutationHooks/task/editTask';
import {setRemindersFromApollo} from '../../utils/reminderUtils';
import {useApolloClient} from '@apollo/client';
import {SelectSubjectPopup} from '../../components/popups/selectSubject/selectSubjectPopup';
import {TaskStackScreenProps} from '../../utils/types';
import {BasicIcon} from '../../components/basicViews/BasicIcon';
import {SubjectColorsObject} from '../../types/Theme';

const TaskDetailScreen: React.FC<TaskStackScreenProps<'TaskDetailScreen'>> = ({
  navigation,
  route,
}) => {
  const {data: Tasks} = useGetAllTasksQuery();
  const task = Tasks?.getAllTasks.find(item => item.id == route.params.task.id);
  const [addSubtask] = useCreateSubtask();

  const client = useApolloClient();

  const [name, setName] = useState(task?.name || '');
  const [text, setText] = useState(task?.text || '');
  const [editTask] = useEditTask();
  const [editDueDateModalIsVisible, setEditDueDateModalIsVisible] =
    useState(false);
  const [editDoDateModalIsVisible, setEditDoDateModalIsVisible] =
    useState(false);
  const [addSubtaskModalIsVisible, setAddSubtaskModalIsVisible] =
    useState(false);

  useEffect(() => {
    if (!task) {
      navigation.goBack();
    }
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setAddSubtaskModalIsVisible(true);
          }}>
          <BasicIcon
            source={require('../../../assets/Plus.png')}
            style={styles.plusButton}
          />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <BackButton
          onPress={() => {
            if (task) {
              editTask({
                id: task.id,
                name,
                text,
                dueDate: task.dueDate,
                dueDateIncludesTime: task.dueDateIncludesTime,
                doDateIncludesTime: task.doDateIncludesTime,
                duration: task.duration,
                doDate: task.doDate,
                subjectId: task.subject?.id,
              });
            }
            navigation.goBack();
          }}
        />
      ),
    });
  });

  if (!task) {
    return (
      <View
        style={{
          flex: 1,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <BasicText textVariant="heading">Task wasn't found</BasicText>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.actionContainer}>
          <BasicButton
            backgroundColor="accentBackground1"
            onPress={() => {
              Keyboard.dismiss();
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
            backgroundColor="accentBackground1"
            onPress={() => {
              Keyboard.dismiss();
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
            extraOnPress={() => {
              Keyboard.dismiss();
            }}
            trigger={
              <BasicButton
                subjectColor={
                  task.subject
                    ? (task.subject.colorName as keyof SubjectColorsObject)
                    : undefined
                }
                variant={task.subject ? 'subject' : 'filled'}
                borderWidth={1}
                backgroundColor="accentBackground1"
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
                dueDateIncludesTime: task.dueDateIncludesTime,
                doDate: task.doDate,
                doDateIncludesTime: task.doDateIncludesTime,
                subjectId: subject?.id || null,
              });
            }}
          />
        </View>
        <BasicTextInput
          style={{marginLeft: 5}}
          variant="unstyled"
          spacing="none"
          textVariant="heading"
          onChangeText={text => {
            setName(text);
          }}
          defaultValue={task.name}
        />
        <BasicTextInput
          variant="unstyled"
          placeholder="Enter task details here"
          multiline={true}
          onChangeText={setText}
          defaultValue={task.text || ''}
          marginBottom={5}
        />
        <FlatList
          contentContainerStyle={{borderRadius: 15, overflow: 'hidden'}}
          data={task.subtasks}
          renderItem={({item, index}) => <Subtask subtask={item} key={index} />}
        />
      </View>
      <EditDateModal
        includesTime={task.dueDateIncludesTime}
        allowNoTime={true}
        initialDate={task.dueDate ? dayjs(task.dueDate) : dayjs()}
        subject={task.subject}
        onClose={() => {
          setEditDueDateModalIsVisible(false);
        }}
        onSubmit={({date, includesTime}) => {
          editTask({
            id: task.id,
            name,
            text,
            dueDate: date?.toDate() || null,
            dueDateIncludesTime: includesTime,
            doDate: task.doDate,
            doDateIncludesTime: task.doDateIncludesTime,
            subjectId: task.subject?.id,
          });
          setEditDueDateModalIsVisible(false);
        }}
        isVisible={editDueDateModalIsVisible}
      />
      <EditDateModal
        showDuration={true}
        initialDuration={task.duration}
        includesTime={task.doDateIncludesTime}
        allowNoTime={true}
        initialDate={task.doDate ? dayjs(task.doDate) : dayjs()}
        initialReminderTimes={task.reminders.map(item => item.minutesBefore)}
        showReminders
        onClose={() => {
          setEditDoDateModalIsVisible(false);
        }}
        onSubmit={async ({date, includesTime, reminderTimes, duration}) => {
          let reminders: RemindersInput[] | undefined;
          if (reminderTimes) {
            reminders = reminderTimes.map(item => {
              console.log('date', dayjs(date).subtract(item, 'minute'));
              const id = uuidv4();
              return {
                id,
                title: task.name,
                minutesBefore: item,
                date: dayjs(date).subtract(item, 'minute').toDate(),
              };
            });
          }
          setEditDoDateModalIsVisible(false);
          console.log(duration);
          await editTask({
            id: task.id,
            name,
            text,
            dueDate: task.dueDate,
            dueDateIncludesTime: task.dueDateIncludesTime,
            doDate: date?.toDate() || null,
            doDateIncludesTime: includesTime,
            reminders,
            subjectId: task.subject?.id,
            duration,
          });
          setRemindersFromApollo(client);
        }}
        isVisible={editDoDateModalIsVisible}
      />
      <BasicInputWindow
        placeholder="New Subtask"
        visible={addSubtaskModalIsVisible}
        onClose={() => {
          setAddSubtaskModalIsVisible(false);
        }}
        onSubmit={value => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          addSubtask({id: uuidv4(), name: value, taskId: task.id});
          setAddSubtaskModalIsVisible(false);
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
