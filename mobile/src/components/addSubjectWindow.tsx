import React, {useState} from 'react';
import {View, TextInput} from 'react-native';
import {
  GetAllSubjectsDocument,
  useCreateSubjectMutation,
} from '../generated/graphql';
import AddButton from './addButton';
import KeyboardTopView from './keyboardTopWindow';

const AddSubjectWindow: React.FC<{onClose: () => void}> = ({onClose}) => {
  const [name, setName] = useState('');
  const [createSubject] = useCreateSubjectMutation();
  return (
    <KeyboardTopView onClose={onClose}>
      <View style={{flexDirection: 'row'}}>
        <TextInput
          style={{padding: 10, flex: 1}}
          placeholder="Subject name"
          onChangeText={setName}
        />
        <AddButton
          onPress={() => {
            createSubject({
              variables: {name},
              refetchQueries: [GetAllSubjectsDocument],
            });
            onClose();
          }}
        />
      </View>
    </KeyboardTopView>
  );
};

export default AddSubjectWindow;
