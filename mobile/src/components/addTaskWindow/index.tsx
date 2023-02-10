import dayjs from 'dayjs';
import React, {createRef, useEffect, useRef, useState} from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import {
  GetAllTasksDocument,
  SubjectFragment,
  useCreateTaskMutation,
  useGetAllLessonsQuery,
} from '../../generated/graphql';
import AddButton from '../addButton';
import EditDateModal from '../editDateWindow/editDateModal';
import {calendarConfigWithoutTime} from '../task';
import {BasicModalCard} from '../basicViews/BasicModalCard';
import {BasicTextInput} from '../basicViews/BasicTextInput';
import {BasicButton} from '../basicViews/BasicButton';
import SelectSubjectModal from '../selectSubject';
import {getCurrentLesson} from '../../utils/lessonUtils';

interface addTaskWindowProps {
  onClose: () => void;
  visible: boolean;
}

const AddTaskWindow: React.FC<addTaskWindowProps> = ({onClose, visible}) => {
  const [addTask, {error}] = useCreateTaskMutation();
  const {data: lessons} = useGetAllLessonsQuery();

  const taskInputRef = createRef<TextInput>();
  const [name, setName] = useState('');
  const [subject, setSubject] = useState<SubjectFragment | null>(null);
  const [viewVisible, setViewVisible] = useState<
    'main' | 'editDate' | 'addSubject' | 'selectSubject'
  >('main');
  const [viewShouldAppear, setViewShouldAppear] = useState<
    'main' | 'editDate' | 'addSubject' | 'selectSubject'
  >('main');
  const [taskDate, setTaskDate] = useState<dayjs.Dayjs | null>();

  useEffect(() => {
    if (visible) {
      taskInputRef.current?.focus();
    }
  }, [visible]);

  useEffect(() => {
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

  return (
    <>
      <BasicModalCard
        alignCard="flex-end"
        isVisible={
          visible && viewVisible == 'main' && viewShouldAppear == 'main'
        }
        avoidKeyboard={true}
        onBackdropPress={() => {
          closeWindow();
        }}
        onModalHide={() => {
          setViewVisible(viewShouldAppear);
        }}>
        <BasicTextInput
          placeholder="Task name"
          ref={taskInputRef}
          value={name}
          onChangeText={setName}
        />
        <View style={styles.bottomContainer}>
          <BasicButton
            onPress={() => setViewShouldAppear('selectSubject')}
            style={styles.button}>
            <Text>{subject?.name || 'Subject'}</Text>
          </BasicButton>
          <BasicButton
            style={styles.button}
            onPress={() => {
              // onEditDate();
              setViewShouldAppear('editDate');
            }}>
            <Text>
              {taskDate
                ? taskDate.calendar(null, calendarConfigWithoutTime)
                : 'Select Date'}
            </Text>
          </BasicButton>
          <AddButton
            onPress={() => {
              console.log(taskDate);
              addTask({
                variables: {
                  name,
                  subjectId: subject ? subject.id : undefined,
                  dueDate: taskDate,
                },
                refetchQueries: [GetAllTasksDocument],
              });
              closeWindow();
            }}
          />
        </View>
      </BasicModalCard>
      <EditDateModal
        isVisible={viewVisible == 'editDate' && viewShouldAppear == 'editDate'}
        initialDate={taskDate ? taskDate : undefined}
        subject={subject}
        onClose={() => {
          setViewShouldAppear('main');
        }}
        onHide={() => {
          setViewVisible(viewShouldAppear);
        }}
        onSubmit={date => {
          setTaskDate(date);
          setViewShouldAppear('main');
        }}
      />
      <SelectSubjectModal
        isVisible={
          viewShouldAppear == 'selectSubject' && viewVisible == 'selectSubject'
        }
        onClose={() => setViewShouldAppear('main')}
        onModalHide={() => {
          setViewVisible(viewShouldAppear);
        }}
        onSubmit={subject => {
          setSubject(subject);
          setViewShouldAppear('main');
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {flexDirection: 'row', justifyContent: 'space-between'},
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AddTaskWindow;
