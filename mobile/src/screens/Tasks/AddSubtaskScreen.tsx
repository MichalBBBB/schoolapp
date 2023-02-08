import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  GetAllTasksDocument,
  useCreateSubtaskMutation,
  useCreateTaskMutation,
} from '../../generated/graphql';
import {TaskStackParamList} from '../../routes/TaskStack';

const AddSubtaskScreen: React.FC<
  NativeStackScreenProps<TaskStackParamList, 'AddSubtaskScreen'>
> = ({navigation, route}) => {
  const [name, setName] = useState('');
  const [addSubtask] = useCreateSubtaskMutation();

  const createTask = async () => {
    await addSubtask({
      variables: {name, taskId: route.params.taskId},
      refetchQueries: [GetAllTasksDocument],
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter task name"
        onChangeText={setName}
        style={styles.inputField}
      />
      <TouchableOpacity
        onPress={() => {
          createTask();
        }}>
        <View style={styles.addButton}>
          <Text>Add</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 50,
  },
  inputField: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
    width: 250,
  },
  addButton: {
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 10,
  },
});

export default AddSubtaskScreen;
