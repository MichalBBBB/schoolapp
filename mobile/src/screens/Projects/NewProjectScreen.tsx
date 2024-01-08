import React, {useEffect, useLayoutEffect} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {View, TextInput} from 'react-native';
import {useState} from 'react';
import {BasicButton} from '../../components/basicViews/BasicButton';
import {BasicTextInput} from '../../components/basicViews/BasicTextInput';
import {BasicText} from '../../components/basicViews/BasicText';
import {BasicCard} from '../../components/basicViews/BasicCard';
import {ProjectStackScreenProps} from '../../utils/types';
import {useCreateProject} from '../../mutationHooks/project/createProject';
import {v4 as uuidv4} from 'uuid';
import {BasicIcon} from '../../components/basicViews/BasicIcon';

export const NewProjectScreen: React.FC<
  ProjectStackScreenProps<'NewProjectScreen'>
> = ({navigation}) => {
  const [name, setName] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [createProject, {error}] = useCreateProject();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <BasicButton
          variant="unstyled"
          onPress={() => {
            createProject({
              name: name,
              memberEmails: members,
              id: uuidv4(),
            });
            navigation.goBack();
          }}>
          <BasicText textVariant="button" color="accent">
            Create
          </BasicText>
        </BasicButton>
      ),
    });
  });

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
      <BasicText color="textSecondary" style={{marginBottom: 5, marginLeft: 5}}>
        Add members
      </BasicText>
      <BasicCard style={{marginBottom: 15}}>
        <View style={styles.horizontalContainer}>
          <BasicTextInput
            spacing="m"
            variant="unstyled"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            textContentType="emailAddress"
            autoCapitalize="none"
            containerStyle={{flex: 1, marginRight: 10}}
          />
          <BasicButton
            style={{marginRight: 5}}
            spacing="none"
            variant="unstyled"
            onPress={() => {
              console.log(email);
              if (!members.includes(email)) {
                setMembers([...members, email]);
              }

              setEmail('');
            }}>
            <BasicIcon
              style={{height: 35, width: 35}}
              source={require('../../../assets/Plus.png')}
            />
          </BasicButton>
        </View>
      </BasicCard>
      <ScrollView style={{flex: 1}}>
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
                  <BasicIcon
                    source={require('../../../assets/Minus.png')}
                    style={{height: 25, width: 25}}
                  />
                </BasicButton>
              </View>
            ))}
          </BasicCard>
        )}
      </ScrollView>

      {/* <View style={styles.addButtonContainer}>
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
            Create Project
          </BasicText>
        </BasicButton>
      </View> */}
    </View>
  );
};
const styles = StyleSheet.create({
  horizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButtonContainer: {},
  emailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    paddingLeft: 10,
  },
  container: {
    padding: 20,
    flex: 1,
  },
});
