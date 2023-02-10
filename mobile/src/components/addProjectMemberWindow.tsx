import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useAddMemberToProjectMutation} from '../generated/graphql';
import {BasicButton} from './basicViews/BasicButton';
import {BasicModalCard} from './basicViews/BasicModalCard';
import {BasicText} from './basicViews/BasicText';
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
          spacing="s"
          placeholder="Email"
          style={{width: 250, marginBottom: 10}}
        />
        <BasicButton
          spacing="s"
          onPress={() => {
            addMember({variables: {projectId, memberEmail: email}});
            onClose();
          }}>
          <BasicText color="background">Invite</BasicText>
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
