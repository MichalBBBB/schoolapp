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
              <Pressable
                style={{marginBottom: 10}}
                onPress={() => {
                  onSubmit(item);
                }}>
                <Text>{item.name}</Text>
              </Pressable>
            )}
          />
          <Pressable
            style={{marginBottom: 10}}
            onPress={() => {
              onSubmit(null);
            }}>
            <Text>None</Text>
          </Pressable>
          <BasicButton
            padding={10}
            onPress={() => {
              setViewShouldAppear('AddSubject');
            }}>
            <Text>Add</Text>
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
