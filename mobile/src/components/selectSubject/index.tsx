import React, {useState} from 'react';
import {View, FlatList, TouchableOpacity, Text, Pressable} from 'react-native';
import {
  GetAllSubjectsDocument,
  SubjectFragment,
  useCreateSubjectMutation,
  useGetAllSubjectsQuery,
} from '../../generated/graphql';
import {BasicButton} from '../basicViews/BasicButton';
import {BasicModalCard} from '../basicViews/BasicModalCard';
import {BasicText} from '../basicViews/BasicText';
import {v4 as uuidv4} from 'uuid';
import {useCreateSubject} from '../../mutationHooks/subject/createSubject';
import AddSubjectWindow from '../addSubjectWindow';
import {useTheme} from '../../contexts/ThemeContext';
import {ColorsObject, SubjectColorsObject} from '../../types/Theme';
import {BasicCard} from '../basicViews/BasicCard';
import {BasicIcon} from '../basicViews/BasicIcon';
import {SubjectModal} from '../subjectModal';

interface SelectSubjectProps {
  onSubmit: (subject: SubjectFragment | null) => void;
  animateClose?: () => void;
  backgroundColor?: keyof ColorsObject;
  onAddSubjects?: () => void;
}

const SelectSubjectWindow: React.FC<SelectSubjectProps> = ({
  onSubmit,
  animateClose,
  backgroundColor = 'accentBackground1',
  onAddSubjects,
}) => {
  const {data} = useGetAllSubjectsQuery();
  const [subjectModalVisible, setSubjectModalVisible] = useState(false);

  const [theme] = useTheme();
  return (
    <BasicCard
      backgroundColor={backgroundColor}
      spacing="m"
      style={{
        minWidth: 130,
        elevation: 8,
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 20,
        maxHeight: 280,
        // overflow: 'hidden',
      }}>
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}>
          <BasicText textVariant="button">Subject</BasicText>
          <BasicButton
            variant="unstyled"
            spacing="none"
            onPress={() => {
              onSubmit(null);
              if (animateClose) animateClose();
            }}>
            <BasicText>clear</BasicText>
          </BasicButton>
        </View>
        <FlatList
          style={{flex: 1, paddingBottom: 5}}
          keyboardShouldPersistTaps="handled"
          data={data?.getAllSubjects}
          renderItem={({item}) => (
            <BasicButton
              spacing="none"
              variant="unstyled"
              style={{marginBottom: 10, alignItems: 'flex-start'}}
              onPress={() => {
                onSubmit(item);
                if (animateClose) animateClose();
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
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
          ListEmptyComponent={() => (
            <BasicText color="textSecondary">No subjects</BasicText>
          )}
          ListFooterComponent={() => (
            <BasicButton
              variant="unstyled"
              spacing="none"
              onPress={() => {
                if (onAddSubjects) {
                  onAddSubjects();
                } else {
                  setSubjectModalVisible(true);
                }
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                  marginTop: 5,
                }}>
                <BasicIcon
                  source={require('../../../assets/Plus.png')}
                  style={{
                    height: 25,
                    width: 25,
                    marginRight: 5,
                  }}
                />
                <BasicText>Add</BasicText>
              </View>
            </BasicButton>
          )}
        />
        <SubjectModal
          isVisible={subjectModalVisible}
          onClose={() => {
            setSubjectModalVisible(false);
          }}
        />
      </View>
    </BasicCard>
  );
};

export default SelectSubjectWindow;
