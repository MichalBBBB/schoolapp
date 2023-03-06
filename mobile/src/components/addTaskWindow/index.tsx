import dayjs from 'dayjs';
import React, {createRef, useEffect, useRef, useState} from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import {
  GetAllEventsDocument,
  GetAllTasksDocument,
  GetAllTasksQuery,
  GetAllTasksQueryResult,
  SubjectFragment,
  useCreateTaskMutation,
  useGetAllLessonsQuery,
} from '../../generated/graphql';
import AddButton from '../addButton';
import EditDateModal from '../editDateWindow';
import {calendarConfigWithoutTime} from '../task';
import {BasicModalCard} from '../basicViews/BasicModalCard';
import {BasicTextInput} from '../basicViews/BasicTextInput';
import {BasicButton} from '../basicViews/BasicButton';
import SelectSubjectWindow from '../selectSubject';
import {getCurrentLesson} from '../../utils/lessonUtils';
import {BasicText} from '../basicViews/BasicText';
import {v4 as uuidv4} from 'uuid';
import {useCreateTask} from '../../mutationHooks/task/createTask';
import {BasicCard} from '../basicViews/BasicCard';
import {SelectSubjectPopup} from '../selectSubject/selectSubjectPopup';
import {useTheme} from '../../contexts/ThemeContext';
import {SubjectColorsObject} from '../../types/Theme';

interface addTaskWindowProps {
  onClose: () => void;
  visible: boolean;
}

const AddTaskWindow: React.FC<addTaskWindowProps> = ({onClose, visible}) => {
  const [addTask, {error}] = useCreateTaskMutation();
  const [createTask] = useCreateTask();
  const {data: lessons} = useGetAllLessonsQuery();

  const [theme] = useTheme();

  const taskInputRef = useRef<TextInput>(null);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState<SubjectFragment | null>(null);
  const [viewVisible, setViewVisible] = useState<'main' | 'editDate'>('main');
  const [taskDate, setTaskDate] = useState<dayjs.Dayjs | null>();

  useEffect(() => {
    if (visible && viewVisible == 'main') {
      console.log('focus');
      taskInputRef.current?.focus();
    }
  }, [visible, viewVisible, taskInputRef]);

  useEffect(() => {
    // automatically set subject to current lesson
    if (lessons?.getAllLessons) {
      setSubject(getCurrentLesson(lessons.getAllLessons)?.subject || null);
    }
  }, [lessons, visible]);

  const closeWindow = () => {
    setName('');
    setSubject(null);
    setTaskDate(null);
    onClose();
  };

  useEffect(() => {
    console.log(visible);
  });

  return (
    <>
      <BasicModalCard
        backgroundColor="background"
        alignCard="flex-end"
        isVisible={visible && viewVisible == 'main'}
        avoidKeyboard={true}
        onBackdropPress={() => {
          console.log('closing window');
          closeWindow();
        }}>
        <BasicTextInput
          spacing="m"
          variant="unstyled"
          placeholder="Task name"
          ref={taskInputRef}
          value={name}
          onChangeText={setName}
        />
        <View style={styles.bottomContainer}>
          <SelectSubjectPopup
            onSubmit={subject => {
              setSubject(subject);
            }}
            trigger={
              <BasicButton
                backgroundColor="accentBackground"
                style={styles.button}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {subject && (
                    <View
                      style={{
                        backgroundColor:
                          theme.subjectColors[
                            subject.colorName as keyof SubjectColorsObject
                          ].primary,
                        height: 16,
                        width: 16,
                        borderRadius: 8,
                        marginRight: 5,
                      }}
                    />
                  )}

                  <BasicText>{subject?.name || 'Subject'}</BasicText>
                </View>
              </BasicButton>
            }
          />

          <BasicButton
            backgroundColor="accentBackground"
            style={styles.button}
            onPress={() => {
              setViewVisible('editDate');
            }}>
            <BasicText>
              {taskDate
                ? taskDate.calendar(null, calendarConfigWithoutTime)
                : 'Select Date'}
            </BasicText>
          </BasicButton>
          <AddButton
            onPress={() => {
              createTask({
                id: uuidv4(),
                name,
                subjectId: subject ? subject.id : undefined,
                dueDate: taskDate,
              });
              closeWindow();
            }}
          />
        </View>
      </BasicModalCard>
      <EditDateModal
        isVisible={visible && viewVisible == 'editDate'}
        initialDate={taskDate ? taskDate : undefined}
        subject={subject}
        onClose={() => {
          setViewVisible('main');
        }}
        onSubmit={date => {
          setTaskDate(date);
          setViewVisible('main');
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {flexDirection: 'row', justifyContent: 'space-between'},
  button: {
    flex: 1,
    paddingHorizontal: 20,
    marginRight: 10,
  },
});

export default AddTaskWindow;
