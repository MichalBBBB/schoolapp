import {useHeaderHeight} from '@react-navigation/elements';
import dayjs from 'dayjs';
import React, {createRef, useEffect, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
} from 'react-native';
import {
  GetAllTasksDocument,
  SubjectFragment,
  useCreateTaskMutation,
} from '../../generated/graphql';
import AddButton from '../addButton';
import EditDateWindow from '../editDateWindow';
import EditDateModal from '../editDateWindow/editDateModal';
import KeyboardTopView from '../keyboardTopWindow';
import {calendarConfigWithoutTime} from '../task';
import SubjectButton from './subjectButton';
import Modal from 'react-native-modal';
import AddSubjectModal from '../addSubjectModal';

interface addTaskWindowProps {
  onClose: () => void;
  visible: boolean;
}

const AddTaskWindow: React.FC<addTaskWindowProps> = ({onClose, visible}) => {
  const headerHeight = useHeaderHeight();
  const taskInputRef = createRef<TextInput>();
  const [addTask, {error}] = useCreateTaskMutation();
  const [name, setName] = useState('');
  const [subject, setSubject] = useState<SubjectFragment | null>(null);
  const [viewVisible, setViewVisible] = useState<
    'main' | 'editDate' | 'addSubject'
  >('main');
  const [viewShouldAppear, setViewShouldAppear] = useState<
    'main' | 'editDate' | 'addSubject'
  >('main');
  const [taskDate, setTaskDate] = useState<dayjs.Dayjs | null>();

  useEffect(() => {
    taskInputRef.current?.focus();
  });

  return (
    <>
      <Modal
        isVisible={
          visible && viewVisible == 'main' && viewShouldAppear == 'main'
        }
        backdropOpacity={0.3}
        avoidKeyboard={true}
        animationIn={'fadeInUp'}
        animationOut={'fadeOutDown'}
        style={{justifyContent: 'flex-end', margin: 10}}
        onBackdropPress={() => {
          onClose();
        }}
        onModalHide={() => {
          setViewVisible(viewShouldAppear);
        }}>
        <View style={{backgroundColor: 'white', padding: 10, borderRadius: 15}}>
          <TextInput
            style={{padding: 10}}
            placeholder="Task name"
            ref={taskInputRef}
            onChangeText={setName}
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <SubjectButton
              onChangeSubject={subject => {
                setSubject(subject);
              }}
              onAddSubject={() => {
                setViewShouldAppear('addSubject');
              }}
            />
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => {
                // onEditDate();
                setViewShouldAppear('editDate');
              }}>
              <View style={styles.button}>
                <Text>
                  {taskDate
                    ? taskDate.calendar(null, calendarConfigWithoutTime)
                    : 'Select Date'}
                </Text>
              </View>
            </TouchableOpacity>
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
                onClose();
              }}
            />
          </View>
        </View>
      </Modal>
      <EditDateModal
        isVisible={viewVisible == 'editDate' && viewShouldAppear == 'editDate'}
        initialDate={taskDate ? taskDate : undefined}
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
      <AddSubjectModal
        isVisible={
          viewShouldAppear == 'addSubject' && viewVisible == 'addSubject'
        }
        onClose={() => setViewShouldAppear('main')}
        onModalHide={() => setViewVisible(viewShouldAppear)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: '#EEE',
    padding: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AddTaskWindow;
