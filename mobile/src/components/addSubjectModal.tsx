import React, {useState} from 'react';
import {View, TextInput} from 'react-native';
import {
  GetAllSubjectsDocument,
  useCreateSubjectMutation,
} from '../generated/graphql';
import AddButton from './addButton';
import KeyboardTopView from './keyboardTopWindow';
import Modal from 'react-native-modal';

const AddSubjectModal: React.FC<{
  onClose: () => void;
  isVisible: boolean;
  onModalHide: () => void;
}> = ({onClose, isVisible, onModalHide}) => {
  const [name, setName] = useState('');
  const [createSubject] = useCreateSubjectMutation();
  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.3}
      avoidKeyboard={true}
      animationIn={'fadeInUp'}
      animationOut={'fadeOutDown'}
      style={{justifyContent: 'flex-end', margin: 10}}
      onBackdropPress={() => {
        onClose();
      }}
      onModalHide={() => onModalHide()}>
      <View
        style={{
          backgroundColor: 'white',
          padding: 10,
          borderRadius: 15,
          flexDirection: 'row',
        }}>
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
    </Modal>
  );
};

export default AddSubjectModal;
