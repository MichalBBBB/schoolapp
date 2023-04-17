import React, {useState} from 'react';
import {View, FlatList, TouchableOpacity, Text, Pressable} from 'react-native';
import {
  SubjectFragment,
  useGetAllSubjectsQuery,
} from '../../../generated/graphql';
import {BasicButton} from '../../basicViews/BasicButton';
import {BasicText} from '../../basicViews/BasicText';
import {useTheme} from '../../../contexts/ThemeContext';
import {ColorsObject, SubjectColorsObject} from '../../../types/Theme';
import {BasicCard} from '../../basicViews/BasicCard';
import {BasicIcon} from '../../basicViews/BasicIcon';
import {SubjectModal} from '../../modals/subjectModal';

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
        minWidth: 150,
        maxWidth: 200,
        elevation: 20,
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
            marginBottom: 10,
            padding: 2,
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
                <BasicText numberOfLines={1}>{item.name}</BasicText>
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
                  source={require('../../../../assets/Plus.png')}
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
