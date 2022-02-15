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
} from 'react-native';
import {
  GetAllTasksDocument,
  SubjectFragment,
  useCreateTaskMutation,
} from '../../generated/graphql';
import AddButton from '../addButton';
import SubjectButton from './subjectButton';

interface addTaskWindowProps {
  onClose: () => void;
}

const AddTaskWindow: React.FC<addTaskWindowProps> = ({onClose}) => {
  const headerHeight = useHeaderHeight();
  const taskInputRef = createRef<TextInput>();
  const [addTask, {error}] = useCreateTaskMutation();
  const [name, setName] = useState('');
  const [subject, setSubject] = useState<SubjectFragment | null>(null);

  useEffect(() => {
    taskInputRef.current?.focus();
  });

  return (
    <KeyboardAvoidingView
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
        position: 'absolute',
      }}
      behavior="position"
      keyboardVerticalOffset={headerHeight}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'black',
            opacity: 0.1,
          }}></View>
      </TouchableWithoutFeedback>
      <View style={{position: 'absolute', bottom: 0, width: '100%'}}>
        <View style={{margin: 5}}>
          <View
            style={{
              backgroundColor: 'white',
              width: '100%',
              borderRadius: 15,
              padding: 10,
            }}>
            <TextInput
              style={{padding: 10}}
              placeholder="Task name"
              ref={taskInputRef}
              onChangeText={setName}
            />
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <SubjectButton
                onChangeSubject={subject => {
                  setSubject(subject);
                }}
              />
              <TouchableOpacity style={{flex: 1}}>
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
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
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
