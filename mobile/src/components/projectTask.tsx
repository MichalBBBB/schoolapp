import React, {useRef} from 'react';
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import {
  GetProjectsDocument,
  ProjectTaskFragment,
  useDeleteProjectTaskMutation,
  useToggleProjectTaskMutation,
} from '../generated/graphql';
import {BasicButton} from './basicViews/BasicButton';
import SlidingView from './slidingView';

const ProjectTask: React.FC<{
  projectTask: ProjectTaskFragment;
  onUsersPress: () => void;
}> = ({projectTask, onUsersPress}) => {
  const [deleteProjectTask] = useDeleteProjectTaskMutation();
  const [toggleProjectTask] = useToggleProjectTaskMutation();

  const back = (
    <TouchableOpacity
      onPress={() => {
        deleteProjectTask({
          variables: {id: projectTask.id},
          refetchQueries: [GetProjectsDocument],
        });
      }}>
      <View
        style={{
          backgroundColor: 'red',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}>
        <Image
          source={require('../../assets/Delete.png')}
          style={{
            resizeMode: 'stretch',
            height: 25,
            width: 25,
          }}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <SlidingView
        frontView={
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={{
                padding: 10,
                backgroundColor: 'white',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  toggleProjectTask({
                    variables: {id: projectTask.id},
                    refetchQueries: [GetProjectsDocument],
                  });
                }}>
                <Image
                  source={
                    projectTask.done
                      ? require('../../assets/Checkmark.png')
                      : require('../../assets/Circle.png')
                  }
                  style={styles.checkMark}
                />
              </TouchableOpacity>
              <Text>{projectTask.name}</Text>
            </View>
            <Pressable
              onPress={() => {
                onUsersPress();
              }}>
              <Text>Add users</Text>
            </Pressable>
          </View>
        }
        backView={[back]}
        backViewWidth={70}
        numberOfBackElements={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  checkMark: {
    resizeMode: 'stretch',
    width: 25,
    height: 25,
    marginRight: 10,
  },
});

export default ProjectTask;
