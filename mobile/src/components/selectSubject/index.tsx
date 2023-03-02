import React, {useState} from 'react';
import {View, FlatList, TouchableOpacity, Text, Pressable} from 'react-native';
import {
  GetAllSubjectsDocument,
  SubjectFragment,
  useCreateSubjectMutation,
  useGetAllSubjectsQuery,
} from '../../generated/graphql';
import BasicInputWindow from '../basicInputWindow';
import {BasicButton} from '../basicViews/BasicButton';
import {BasicModalCard} from '../basicViews/BasicModalCard';
import {BasicText} from '../basicViews/BasicText';
import {v4 as uuidv4} from 'uuid';
import {useCreateSubject} from '../../mutationHooks/subject/createSubject';
import AddSubjectWindow from '../addSubjectWindow';
import {useTheme} from '../../contexts/ThemeContext';
import {SubjectColorsObject} from '../../types/Theme';
import {BasicCard} from '../basicViews/BasicCard';

interface SelectSubjectProps {
  onSubmit: (subject: SubjectFragment | null) => void;
  closeModal?: () => void;
}

const SelectSubjectWindow: React.FC<SelectSubjectProps> = ({
  onSubmit,
  closeModal,
}) => {
  const {data} = useGetAllSubjectsQuery();
  const [addSubject] = useCreateSubject();

  const [theme] = useTheme();
  const [viewVisible, setViewVisible] = useState<
    'SelectSubject' | 'AddSubject'
  >('SelectSubject');
  const [viewShouldAppear, setViewShouldAppear] = useState<
    'SelectSubject' | 'AddSubject'
  >('SelectSubject');
  return (
    <BasicCard
      backgroundColor="accentBackground"
      spacing="m"
      style={{
        elevation: 8,
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 20,
        maxHeight: 300,
      }}>
      <View>
        <FlatList
          data={data?.getAllSubjects}
          renderItem={({item}) => (
            <BasicButton
              spacing="none"
              variant="unstyled"
              style={{marginBottom: 10, alignItems: 'flex-start'}}
              onPress={() => {
                onSubmit(item);
                if (closeModal) closeModal();
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    height: 20,
                    width: 20,
                    backgroundColor:
                      theme.subjectColors[
                        item.colorName as keyof SubjectColorsObject
                      ].primary,
                    borderRadius: 10,
                    marginRight: 10,
                  }}
                />
                <BasicText>{item.name}</BasicText>
              </View>
            </BasicButton>
          )}
          ListFooterComponent={
            <BasicButton
              variant="unstyled"
              spacing="none"
              style={{marginBottom: 10, alignItems: 'flex-start'}}
              onPress={() => {
                onSubmit(null);
              }}>
              <View style={{flexDirection: 'row'}}>
                <View
                  style={{
                    height: 20,
                    width: 20,
                    backgroundColor: 'trasparent',
                    borderRadius: 10,
                    marginRight: 10,
                  }}
                />
                <BasicText>None</BasicText>
              </View>
            </BasicButton>
          }
        />

        {/* <BasicButton
          spacing="s"
          onPress={() => {
            setViewShouldAppear('AddSubject');
          }}>
          <BasicText color="background">Add</BasicText>
        </BasicButton> */}
      </View>
    </BasicCard>
  );
};

export default SelectSubjectWindow;
