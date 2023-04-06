import React, {useState} from 'react';
import {View, Pressable, Image} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';
import {SubjectFragment} from '../generated/graphql';
import {useDeleteSubject} from '../mutationHooks/subject/deleteSubject';
import {useEditSubject} from '../mutationHooks/subject/editSubject';
import {SubjectColorsObject} from '../types/Theme';
import {BasicTextInput} from './basicViews/BasicTextInput';
import {ColorPickerPopup} from './colorPickerPopup';

interface SubjectProps {
  subject: SubjectFragment;
}

export const Subject: React.FC<SubjectProps> = ({subject}) => {
  const [deleteSubject] = useDeleteSubject();
  const [editSubject] = useEditSubject();
  const [subjectName, setSubjectName] = useState(subject.name);
  const [theme] = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 8,
        alignItems: 'center',
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <ColorPickerPopup
          trigger={
            <Pressable
              style={{
                marginRight: 15,
                height: 20,
                width: 20,
                borderRadius: 10,
                backgroundColor:
                  theme.subjectColors[
                    subject.colorName as keyof SubjectColorsObject
                  ].primary,
              }}
            />
          }
          onSubmit={color => {
            editSubject({
              id: subject.id,
              name: subject.name,
              colorName: color,
            });
          }}
          initialColor={subject.colorName as keyof SubjectColorsObject}
        />

        <BasicTextInput
          onBlur={() => {
            editSubject({
              name: subjectName,
              id: subject.id,
              colorName: subject.colorName,
            });
          }}
          onChangeText={value => {
            setSubjectName(value);
          }}
          defaultValue={subject.name}
          variant={'unstyled'}
        />
      </View>
      <Pressable onPress={() => deleteSubject({id: subject.id})}>
        <Image
          source={require('../../assets/Delete.png')}
          style={{height: 30, width: 30}}
        />
      </Pressable>
    </View>
  );
};
