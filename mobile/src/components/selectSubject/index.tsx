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

interface SelectSubjectProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (subject: SubjectFragment | null) => void;
  onModalHide?: (() => void) | undefined;
}

const SelectSubjectModal: React.FC<SelectSubjectProps> = ({
  isVisible,
  onClose,
  onSubmit,
  onModalHide,
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
    <>
      <BasicModalCard
        spacing="l"
        shouldStretchWidth={false}
        isVisible={
          isVisible &&
          viewShouldAppear == 'SelectSubject' &&
          viewVisible == 'SelectSubject'
        }
        alignCard={'center'}
        onBackdropPress={() => {
          onClose();
        }}
        onModalHide={() => {
          if (viewShouldAppear == 'AddSubject') {
            setViewVisible('AddSubject');
          } else if (onModalHide) {
            onModalHide();
          }
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
          />
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
          <BasicButton
            spacing="s"
            onPress={() => {
              setViewShouldAppear('AddSubject');
            }}>
            <BasicText color="background">Add</BasicText>
          </BasicButton>
        </View>
      </BasicModalCard>
      <AddSubjectWindow
        visible={
          viewVisible == 'AddSubject' && viewShouldAppear == 'AddSubject'
        }
        onClose={() => {
          setViewShouldAppear('SelectSubject');
        }}
        onModalHide={() => {
          setViewVisible('SelectSubject');
        }}
      />
    </>
  );
};

export default SelectSubjectModal;
