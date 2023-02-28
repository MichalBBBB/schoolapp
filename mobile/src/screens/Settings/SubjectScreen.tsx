import React, {useEffect, useLayoutEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Pressable, View, Image} from 'react-native';
import {SettingsStackParamList} from '../../routes/SettingsStack';
import {FlatList} from 'react-native-gesture-handler';
import {SubjectFragment, useGetAllSubjectsQuery} from '../../generated/graphql';
import {BasicText} from '../../components/basicViews/BasicText';
import {useTheme} from '../../contexts/ThemeContext';
import {BasicButton} from '../../components/basicViews/BasicButton';
import AddTaskWindow from '../../components/addTaskWindow';
import BasicInputWindow from '../../components/basicInputWindow';
import {useCreateSubject} from '../../mutationHooks/subject/createSubject';
import {v4 as uuidv4} from 'uuid';
import {useDeleteSubject} from '../../mutationHooks/subject/deleteSubject';
import AddSubjectWindow from '../../components/addSubjectWindow';
import {SubjectColorsObject} from '../../types/Theme';
import {ColorPicker} from '../../components/colorPicker';
import {useEditSubject} from '../../mutationHooks/subject/editSubject';
import {BasicTextInput} from '../../components/basicViews/BasicTextInput';

export const SubjectScreen: React.FC<
  NativeStackScreenProps<SettingsStackParamList, 'SubjectScreen'>
> = ({navigation}) => {
  const {data: subjects} = useGetAllSubjectsQuery();
  const [deleteSubject] = useDeleteSubject();
  const [editSubject] = useEditSubject();

  const [addSubjectWindowVisible, setAddSubjectWindowVisible] = useState(false);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [activeName, setActiveName] = useState('');

  const [activeSubject, setActiveSubject] = useState<SubjectFragment | null>(
    null,
  );
  const [theme] = useTheme();

  useEffect(() => {
    console.log(activeSubject);
  });

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
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Pressable
                onPress={() => {
                  setActiveSubject(item);
                  setColorPickerVisible(true);
                }}
                style={{
                  marginRight: 15,
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  backgroundColor:
                    theme.subjectColors[
                      item.colorName as keyof SubjectColorsObject
                    ].primary,
                }}
              />
              <BasicTextInput
                onFocus={() => {
                  setActiveSubject(item);
                  setActiveName(item.name);
                }}
                onBlur={() => {
                  editSubject({
                    name: activeName,
                    id: activeSubject?.id || '',
                    colorName: activeSubject?.colorName || '',
                  });
                  setActiveName('');
                  setActiveSubject(null);
                }}
                onChangeText={value => {
                  setActiveName(value);
                }}
                value={activeSubject?.id == item.id ? activeName : item.name}
                variant={'unstyled'}
              />
            </View>
            <Pressable onPress={() => deleteSubject({id: item.id})}>
              <Image
                source={require('../../../assets/Delete.png')}
                style={{height: 30, width: 30}}
              />
            </Pressable>
          </View>
        )}
      />
      <AddSubjectWindow
        visible={addSubjectWindowVisible}
        onClose={() => setAddSubjectWindowVisible(false)}
      />
      <ColorPicker
        initialColor={activeSubject?.colorName as keyof SubjectColorsObject}
        isVisible={colorPickerVisible}
        onClose={() => {
          setColorPickerVisible(false);
        }}
        onSubmit={color => {
          editSubject({
            id: activeSubject?.id || '',
            name: activeSubject?.name || '',
            colorName: color,
          });
          setColorPickerVisible(false);
          setActiveSubject(null);
        }}
      />
    </>
  );
};
