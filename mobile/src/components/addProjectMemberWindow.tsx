import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useAddMemberToProjectMutation} from '../generated/graphql';
import {BasicButton} from './basicViews/BasicButton';
import {BasicModalCard} from './basicViews/BasicModalCard';
import {BasicTextInput} from './basicViews/BasicTextInput';

interface AddProjectMemberWindowProps {
  projectId: string;
  isVisible: boolean;
  onClose: () => void;
}

export const AddProjectMemberWindow: React.FC<AddProjectMemberWindowProps> = ({
  projectId,
  isVisible,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [addMember] = useAddMemberToProjectMutation();
  return (
    <BasicModalCard
      isVisible={isVisible}
      onBackdropPress={onClose}
      alignCard={'center'}>
      <View style={styles.container}>
        <BasicTextInput
          onChangeText={setEmail}
          padding={10}
          backgroundColor="#eee"
          borderRadius={10}
          placeholder="Email"
          style={{width: 250, marginBottom: 10}}
        />
        <BasicButton
          padding={10}
          onPress={() => {
            addMember({variables: {projectId, memberEmail: email}});
            onClose();
          }}>
          <Text>Invite</Text>
        </BasicButton>
      </View>
    </BasicModalCard>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
