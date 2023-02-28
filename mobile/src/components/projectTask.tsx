import React, {useRef} from 'react';
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import {BaseButton} from 'react-native-gesture-handler';
import {useTheme} from '../contexts/ThemeContext';
import {
  GetProjectsDocument,
  ProjectTaskFragment,
  useDeleteProjectTaskMutation,
  useToggleProjectTaskMutation,
} from '../generated/graphql';
import {BasicButton} from './basicViews/BasicButton';
import {BasicText} from './basicViews/BasicText';
import SlidingView from './slidingView';

const ProjectTask: React.FC<{
  projectTask: ProjectTaskFragment;
  onUsersPress: () => void;
}> = ({projectTask, onUsersPress}) => {
  const [deleteProjectTask] = useDeleteProjectTaskMutation();
  const [toggleProjectTask] = useToggleProjectTaskMutation();

  const [theme] = useTheme();

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
            style={[
              styles.container,
              {backgroundColor: theme.colors.background},
            ]}>
            <View style={styles.leftContainer}>
              <BasicButton
                variant="unstyled"
                spacing="none"
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
              </BasicButton>
              <BasicText>{projectTask.name}</BasicText>
            </View>
            <BasicButton
              variant="unstyled"
              onPress={() => {
                onUsersPress();
              }}>
              <BasicText color="textSecondary">Add users</BasicText>
            </BasicButton>
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
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ProjectTask;
