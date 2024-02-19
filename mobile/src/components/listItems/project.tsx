import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Pressable, Text} from 'react-native';
import {
  GetProjectsDocument,
  ProjectFragment,
  useDeleteProjectMutation,
} from '../../generated/graphql';
import {ProjectNavigationProp} from '../../types/navigationTypes';
import {BasicButton} from '../basicViews/BasicButton';
import {BasicCard} from '../basicViews/BasicCard';
import {BasicText} from '../basicViews/BasicText';

interface ProjectProps {
  project: ProjectFragment;
}
export const Project: React.FC<ProjectProps> = ({project}) => {
  const [deleteProject] = useDeleteProjectMutation();
  const navigation = useNavigation<ProjectNavigationProp>();
  return (
    <View style={{margin: 5}}>
      <Pressable
        onPress={() => {
          navigation.navigate('ProjectDetailScreen', {
            projectId: project.id,
          });
        }}>
        <BasicCard backgroundColor="accentBackground1" spacing="l">
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <BasicText textVariant="subHeading">{project.name}</BasicText>
            <BasicText color="textSecondary">{`${
              project.members.length
            } Member${project.members.length == 1 ? '' : 's'}`}</BasicText>
          </View>
          {project.text && (
            <BasicText
              numberOfLines={1}
              color="textSecondary"
              style={{marginTop: 5}}>
              {project.text}
            </BasicText>
          )}
        </BasicCard>
      </Pressable>
    </View>
  );
};
