import React from 'react';
import {View, FlatList, TouchableOpacity, Text, Pressable} from 'react-native';
import {Subject, useGetAllSubjectsQuery} from '../../generated/graphql';
import {BasicButton} from '../basicViews/BasicButton';
import {BasicModalCard} from '../basicViews/BasicModalCard';

interface SelectSubjectProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (subject: Subject) => void;
  onModalHide?: (() => void) | undefined;
  onOpenAddSubject: () => void;
}

const SelectSubjectModal: React.FC<SelectSubjectProps> = ({
  isVisible,
  onClose,
  onSubmit,
  onModalHide,
  onOpenAddSubject,
}) => {
  const {data} = useGetAllSubjectsQuery();
  return (
    <BasicModalCard
      isVisible={isVisible}
      alignCard={'center'}
      onBackdropPress={() => {
        onClose();
      }}
      onModalHide={() => {
        if (onModalHide) {
          onModalHide();
        }
      }}>
      <View>
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
        <BasicButton
          padding={10}
          onPress={() => {
            onOpenAddSubject();
          }}>
          <Text>Add</Text>
        </BasicButton>
      </View>
    </BasicModalCard>
  );
};

export default SelectSubjectModal;
