import React, {useEffect} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StyleSheet, Text} from 'react-native';
import {TaskStackParamList} from '../../routes/TaskStack';
import {View, TextInput} from 'react-native';
import {useState} from 'react';
import {BasicButton} from '../../components/basicViews/BasicButton';
import {
  GetProjectsDocument,
  useCreateProjectMutation,
} from '../../generated/graphql';
import {BasicTextInput} from '../../components/basicViews/BasicTextInput';
import {BasicText} from '../../components/basicViews/BasicText';
import {BasicCard} from '../../components/basicViews/BasicCard';

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
      <BasicTextInput
        placeholder="Name"
        onChangeText={setName}
        spacing="m"
        marginBottom={30}
      />
      <View style={[styles.horizontalContainer, {marginBottom: 10}]}>
        <BasicTextInput
          spacing="m"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          textContentType="emailAddress"
          autoCapitalize="none"
          style={{flex: 1, marginRight: 10}}
        />
        <BasicButton
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
      {members.length > 0 && (
        <BasicCard gap={10} spacing="m" marginBottom={10}>
          {members.map((item, memberIndex) => (
            <View style={styles.emailContainer} key={memberIndex}>
              <BasicText>{item}</BasicText>
              <BasicButton
                spacing="none"
                variant="unstyled"
                onPress={() => {
                  setMembers(
                    members.filter((_, index) => index !== memberIndex),
                  );
                }}>
                <BasicText color="dangerous">Remove</BasicText>
              </BasicButton>
            </View>
          ))}
        </BasicCard>
      )}

      <View style={styles.addButtonContainer}>
        <BasicButton
          spacing="m"
          onPress={() => {
            createProject({
              variables: {name: name, memberEmails: members},
              refetchQueries: [GetProjectsDocument],
            });
          }}>
          <BasicText textVariant="button" color="textContrast">
            Add Project
          </BasicText>
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
    alignItems: 'center',
  },
  container: {
    padding: 20,
  },
});
