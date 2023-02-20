import React, {useLayoutEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Pressable, View, Image} from 'react-native';
import {SettingsStackParamList} from '../../routes/SettingsStack';
import {FlatList} from 'react-native-gesture-handler';
import {useGetAllSubjectsQuery} from '../../generated/graphql';
import {BasicText} from '../../components/basicViews/BasicText';
import {useTheme} from '../../contexts/ThemeContext';
import {BasicButton} from '../../components/basicViews/BasicButton';
import AddTaskWindow from '../../components/addTaskWindow';
import BasicInputWindow from '../../components/basicInputWindow';
import {useCreateSubject} from '../../mutationHooks/subject/createSubject';
import {v4 as uuidv4} from 'uuid';
import {useDeleteSubject} from '../../mutationHooks/subject/deleteSubject';

export const SubjectScreen: React.FC<
  NativeStackScreenProps<SettingsStackParamList, 'SubjectScreen'>
> = ({navigation}) => {
  const {data: subjects} = useGetAllSubjectsQuery();
  const [createSubject] = useCreateSubject();
  const [deleteSubject] = useDeleteSubject();

  const [addSubjectWindowVisible, setAddSubjectWindowVisible] = useState(false);
  const [theme] = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => {
            setAddSubjectWindowVisible(true);
          }}>
          <BasicText textVariant="button">Add</BasicText>
        </Pressable>
      ),
    });
  });

  return (
    <>
      <FlatList
        style={{
          margin: 10,
        }}
        data={subjects?.getAllSubjects}
        renderItem={({item, index}) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 10,
              alignItems: 'center',
            }}>
            <BasicText>{item.name}</BasicText>
            <Pressable onPress={() => deleteSubject({id: item.id})}>
              <Image
                source={require('../../../assets/Delete.png')}
                style={{height: 30, width: 30}}
              />
            </Pressable>
          </View>
        )}
      />
      <BasicInputWindow
        visible={addSubjectWindowVisible}
        onClose={() => setAddSubjectWindowVisible(false)}
        onSubmit={value => {
          createSubject({name: value, id: uuidv4()});
          setAddSubjectWindowVisible(false);
        }}
      />
    </>
  );
};
