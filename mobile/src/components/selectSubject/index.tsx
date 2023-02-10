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
  const [addSubject] = useCreateSubjectMutation();
  const [viewVisible, setViewVisible] = useState<
    'SelectSubject' | 'AddSubject'
  >('SelectSubject');
  const [viewShouldAppear, setViewShouldAppear] = useState<
    'SelectSubject' | 'AddSubject'
  >('SelectSubject');
  return (
    <>
      <BasicModalCard
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
        <View style={{alignItems: 'center'}}>
          <FlatList
            contentContainerStyle={{alignItems: 'center'}}
            data={data?.getAllSubjects}
            renderItem={({item}) => (
              <BasicButton
                spacing="none"
                variant="unstyled"
                style={{marginBottom: 10}}
                onPress={() => {
                  onSubmit(item);
                }}>
                <Text>{item.name}</Text>
              </BasicButton>
            )}
          />
          <BasicButton
            variant="unstyled"
            spacing="none"
            style={{marginBottom: 10}}
            onPress={() => {
              onSubmit(null);
            }}>
            <BasicText>None</BasicText>
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
      <BasicInputWindow
        placeholder="Subject name"
        onSubmit={text => {
          addSubject({
            variables: {name: text},
            refetchQueries: [GetAllSubjectsDocument],
          });
        }}
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
