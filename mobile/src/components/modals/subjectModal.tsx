import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Pressable,
  View,
} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import {useGetAllSubjectsQuery, SubjectFragment} from '../../generated/graphql';
import {useDeleteSubject} from '../../mutationHooks/subject/deleteSubject';
import {useEditSubject} from '../../mutationHooks/subject/editSubject';
import {SubjectColorsObject} from '../../types/Theme';
import AddSubjectWindow from './addSubjectWindow';
import {BasicButton} from '../basicViews/BasicButton';
import {
  BasicModalCard,
  BasicModalCardProps,
} from '../basicViews/BasicModalCard';
import {BasicText} from '../basicViews/BasicText';
import {BasicTextInput} from '../basicViews/BasicTextInput';
import {ColorPickerPopup} from '../popups/colorPickerPopup';
import {Subject} from '../listItems/subject';

interface SubjectModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const SubjectModal: React.FC<SubjectModalProps> = ({
  isVisible,
  onClose,
}) => {
  const {data: subjects} = useGetAllSubjectsQuery();

  const [addSubjectWindowVisible, setAddSubjectWindowVisible] = useState(false);

  return (
    <BasicModalCard
      alignCard="center"
      spacing="l"
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={{height: 400}}>
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 5,
          }}>
          <BasicText textVariant="heading">Subjects</BasicText>
          <BasicButton
            variant="unstyled"
            spacing="none"
            onPress={() => {
              setAddSubjectWindowVisible(true);
            }}>
            <BasicText textVariant="button">Add</BasicText>
          </BasicButton>
        </View>
        <FlatList
          keyboardDismissMode="on-drag"
          style={{
            flex: 1,
          }}
          data={subjects?.getAllSubjects}
          renderItem={({item, index}) => <Subject subject={item} key={index} />}
          ListEmptyComponent={() => (
            <View style={{width: '100%', alignItems: 'center', marginTop: 20}}>
              <BasicText color={'textSecondary'}>No subjects</BasicText>
            </View>
          )}
        />

        <View style={{alignItems: 'flex-end'}}>
          <BasicButton
            variant="unstyled"
            onPress={() => {
              onClose();
            }}>
            <BasicText textVariant="button">Done</BasicText>
          </BasicButton>
        </View>
        <AddSubjectWindow
          visible={addSubjectWindowVisible}
          onClose={() => setAddSubjectWindowVisible(false)}
        />
      </View>
    </BasicModalCard>
  );
};
