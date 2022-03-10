import {useHeaderHeight} from '@react-navigation/elements';
import React, {createRef, useEffect, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Button,
} from 'react-native';
import {
  GetAllTasksDocument,
  SubjectFragment,
  useCreateTaskMutation,
} from '../../generated/graphql';
import AddButton from '../addButton';
import EditDateWindow from '../editDateWindow';
import KeyboardTopView from '../keyboardTopWindow';
import SubjectButton from './subjectButton';

interface addTaskWindowProps {
  onClose: () => void;
  onAddSubject: () => void;
  onEditDate: () => void;
}

const AddTaskWindow: React.FC<addTaskWindowProps> = ({
  onClose,
  onAddSubject,
  onEditDate,
}) => {
  const headerHeight = useHeaderHeight();
  const taskInputRef = createRef<TextInput>();
  const [addTask, {error}] = useCreateTaskMutation();
  const [name, setName] = useState('');
  const [subject, setSubject] = useState<SubjectFragment | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    taskInputRef.current?.focus();
  });

  return (
    <>
      <KeyboardTopView
        onClose={() => {
          onClose();
        }}
        visible={!modalVisible}>
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
              onAddSubject();
            }}
          />
          <TouchableOpacity
            style={{flex: 1}}
            onPress={() => {
              // onEditDate();
              setModalVisible(true);
            }}>
            <View style={styles.button}>
              <Text>Tomorrow</Text>
            </View>
          </TouchableOpacity>
          <AddButton
            onPress={() => {
              addTask({
                variables: {
                  name,
                  subjectId: subject ? subject.id : undefined,
                },
                refetchQueries: [GetAllTasksDocument],
              });
              onClose();
            }}
          />
        </View>
      </KeyboardTopView>
      <Modal visible={modalVisible} transparent={true}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <EditDateWindow
            onClose={() => {
              setModalVisible(false);
            }}
          />
        </View>
      </Modal>
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
