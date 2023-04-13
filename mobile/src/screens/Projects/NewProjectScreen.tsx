import React, {useEffect} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {StyleSheet, Text} from 'react-native';
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
import {ProjectStackScreenProps} from '../../utils/types';
import {useCreateProject} from '../../mutationHooks/project/createProject';
import {v4 as uuidv4} from 'uuid';

export const NewProjectScreen: React.FC<
  ProjectStackScreenProps<'NewProjectScreen'>
> = ({navigation}) => {
  const [name, setName] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [createProject, {error}] = useCreateProject();

  useEffect(() => {
    console.log(JSON.stringify(error));
  }, [error]);
  return (
    <View style={styles.container}>
      <BasicTextInput
        placeholder="Name"
        onChangeText={setName}
        spacing="m"
        marginBottom={20}
      />
      <View style={[styles.horizontalContainer, {marginBottom: 10}]}>
        <BasicTextInput
          spacing="m"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          textContentType="emailAddress"
          autoCapitalize="none"
          containerStyle={{flex: 1, marginRight: 10}}
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
              name: name,
              memberEmails: members,
              id: uuidv4(),
            });
            navigation.goBack();
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
