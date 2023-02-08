import React, {useEffect} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StyleSheet, Text} from 'react-native';
import {TaskStackParamList} from '../../routes/TaskStack';
import ConnectedList from '../../components/connectedList';
import {View, TextInput} from 'react-native';
import {useState} from 'react';
import {BasicButton} from '../../components/basicViews/BasicButton';
import {
  GetProjectsDocument,
  useCreateProjectMutation,
} from '../../generated/graphql';

export const NewProjectScreen: React.FC<
  NativeStackScreenProps<TaskStackParamList, 'NewProjectScreen'>
> = () => {
  const [name, setName] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [createProject, {error}] = useCreateProjectMutation();

  useEffect(() => {
    console.log(JSON.stringify(error));
  }, [error]);
  return (
    <View style={styles.container}>
      <ConnectedList bottomMargin={10}>
        <TextInput
          style={styles.nameInput}
          placeholder="Name"
          onChangeText={setName}
        />
      </ConnectedList>
      <ConnectedList bottomMargin={10}>
        <View style={styles.horizontalContainer}>
          <TextInput
            style={styles.emailInput}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            textContentType="emailAddress"
            autoCapitalize="none"
          />
          <BasicButton
            padding={5}
            borderRadius={10}
            style={{margin: 5}}
            backgroundColor="black"
            onPress={() => {
              console.log(email);
              if (!members.includes(email)) {
                setMembers([...members, email]);
              }

              setEmail('');
            }}>
            <Text style={{color: 'white'}}>Invite</Text>
          </BasicButton>
        </View>
        {members.map((item, memberIndex) => (
          <View style={styles.emailContainer} key={memberIndex}>
            <Text style={styles.memberEmail}>{item}</Text>
            <BasicButton
              onPress={() => {
                setMembers(members.filter((_, index) => index !== memberIndex));
              }}
              style={styles.removeButton}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </BasicButton>
          </View>
        ))}
      </ConnectedList>
      <View style={styles.addButtonContainer}>
        <BasicButton
          padding={10}
          backgroundColor="black"
          onPress={() => {
            createProject({
              variables: {name: name, memberEmails: members},
              refetchQueries: [GetProjectsDocument],
            });
          }}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Add Project</Text>
        </BasicButton>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  horizontalContainer: {
    flexDirection: 'row',
  },
  addButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  emailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    padding: 20,
  },
  nameInput: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 10,
  },
  emailInput: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 10,
    flex: 1,
  },
  memberEmail: {
    padding: 5,
    paddingHorizontal: 10,
  },
  removeButton: {
    margin: 5,
    marginHorizontal: 10,
  },
  removeButtonText: {
    color: 'red',
  },
});
