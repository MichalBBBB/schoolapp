import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Pressable, Text} from 'react-native';
import {
  GetProjectsDocument,
  ProjectFragment,
  useDeleteProjectMutation,
} from '../generated/graphql';
import {ProjectNavigationProp} from '../utils/types';
import {BasicButton} from './basicViews/BasicButton';
import {BasicCard} from './basicViews/BasicCard';
import {BasicText} from './basicViews/BasicText';

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
        <BasicCard backgroundColor="accentBackground1" spacing="m">
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <BasicText>{project.name}</BasicText>
            <BasicButton
              spacing="none"
              variant="unstyled"
              onPress={() =>
                deleteProject({
                  variables: {id: project.id},
                  refetchQueries: [GetProjectsDocument],
                })
              }>
              <Text style={{color: 'red'}}>Delete</Text>
            </BasicButton>
          </View>
        </BasicCard>
      </Pressable>
    </View>
  );
};
