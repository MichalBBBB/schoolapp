import dayjs from 'dayjs';
import React, {createRef, useEffect, useRef, useState} from 'react';
import {View, TextInput, Text, StyleSheet, LayoutAnimation} from 'react-native';
import {
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
import {getCurrentLesson} from '../../utils/lessonUtils';
import {BasicText} from '../basicViews/BasicText';
import {v4 as uuidv4} from 'uuid';
import {useCreateTask} from '../../mutationHooks/task/createTask';
import {SelectSubjectPopup} from '../selectSubject/selectSubjectPopup';
import {useTheme} from '../../contexts/ThemeContext';
import {SubjectColorsObject} from '../../types/Theme';
import {useSettings} from '../../utils/useSettings';
import {SubjectModal} from '../subjectModal';

interface addTaskWindowProps {
  onClose: () => void;
  visible: boolean;
}

const AddTaskWindow: React.FC<addTaskWindowProps> = ({onClose, visible}) => {
  const [addTask, {error}] = useCreateTaskMutation();
  const [createTask] = useCreateTask();
  const {data: lessons} = useGetAllLessonsQuery();

  const [theme] = useTheme();
  const settings = useSettings();

  const taskInputRef = useRef<TextInput>(null);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState<SubjectFragment | null>(null);
  const [viewVisible, setViewVisible] = useState<
    'main' | 'editDate' | 'subject'
  >('main');
  const [taskDate, setTaskDate] = useState<dayjs.Dayjs | null>(null);

  useEffect(() => {
    // automatically set subject to current lesson
    if (lessons?.getAllLessons && settings) {
      setSubject(
        getCurrentLesson(lessons.getAllLessons, settings)?.subject || null,
      );
    }
  }, [lessons, visible, settings]);

  const closeWindow = () => {
    setName('');
    setSubject(null);
    setTaskDate(null);
    onClose();
  };

  return (
    <>
      <BasicModalCard
        backgroundColor="modal"
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
          defaultValue={name}
          onChangeText={setName}
          autoFocus={true}
        />
        <View style={styles.bottomContainer}>
          <SelectSubjectPopup
            onAddSubjects={() => {
              setViewVisible('subject');
            }}
            triggerContainerStyle={styles.button}
            backgroundColor="accentBackground2"
            onSubmit={subject => {
              setSubject(subject);
            }}
            trigger={
              <BasicButton
                variant={subject ? 'subject' : 'filled'}
                borderWidth={1}
                backgroundColor="accentBackground2"
                subjectColor={
                  subject
                    ? (subject.colorName as keyof SubjectColorsObject)
                    : undefined
                }
                style={{flex: 1, paddingHorizontal: 20}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <BasicText numberOfLines={1}>
                    {subject?.name || 'Subject'}
                  </BasicText>
                </View>
              </BasicButton>
            }
          />

          <BasicButton
            backgroundColor="accentBackground2"
            style={[styles.button]}
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
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );
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
      <SubjectModal
        isVisible={visible && viewVisible == 'subject'}
        onClose={() => {
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
    marginRight: 10,
  },
});

export default AddTaskWindow;
