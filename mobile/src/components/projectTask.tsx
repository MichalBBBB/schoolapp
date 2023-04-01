import React, {useRef, useState} from 'react';
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
import {ColorsObject} from '../types/Theme';
import {AssignMembersWindow} from './assignMembersWindow';
import {BasicButton} from './basicViews/BasicButton';
import {BasicIcon} from './basicViews/BasicIcon';
import {BasicText} from './basicViews/BasicText';
import EditProjectTaskWindow from './editProjectTaskWindow';
import {Menu} from './menu';
import {MenuItem} from './menu/MenuItem';
import {Popup} from './popup';
import SlidingView from './slidingView';

const ProjectTask: React.FC<{
  projectTask: ProjectTaskFragment;
  backgroundColor?: keyof ColorsObject;
}> = ({projectTask, backgroundColor = 'background'}) => {
  const [deleteProjectTask] = useDeleteProjectTaskMutation({
    context: {skipQeue: true},
  });
  const [toggleProjectTask] = useToggleProjectTaskMutation({
    context: {skipQeue: true},
  });

  const [isAssignMembersVisible, setIsAssignMembersVisible] = useState(false);
  const [isEditProjectTaskVisible, setIsEditProjectTaskVisible] =
    useState(false);

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
              {backgroundColor: theme.colors[backgroundColor]},
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
                <BasicIcon
                  source={
                    projectTask.done
                      ? require('../../assets/Checkmark.png')
                      : require('../../assets/Circle.png')
                  }
                  style={styles.checkMark}
                />
              </BasicButton>
              <View>
                <BasicText>{projectTask.name}</BasicText>
                {projectTask.publicUsers.length > 0 && (
                  <BasicText numberOfLines={1} color="textSecondary">
                    {projectTask.publicUsers.map(
                      (item, index) => `${index == 0 ? '' : ', '}${item.name}`,
                    )}
                  </BasicText>
                )}
              </View>
            </View>
            <Popup
              trigger={
                <BasicButton
                  variant="unstyled"
                  spacing="none"
                  style={{marginRight: 5}}>
                  <BasicIcon
                    style={{height: 20, width: 20}}
                    source={require('../../assets/Options.png')}
                  />
                </BasicButton>
              }>
              <Menu>
                <MenuItem
                  text="Assign users"
                  onPress={() => {
                    setIsAssignMembersVisible(true);
                  }}
                />
                <MenuItem
                  text="Edit"
                  onPress={() => {
                    setIsEditProjectTaskVisible(true);
                  }}
                />
              </Menu>
            </Popup>
          </View>
        }
        backView={[back]}
        backViewWidth={70}
        numberOfBackElements={1}
      />
      <AssignMembersWindow
        isVisible={isAssignMembersVisible}
        taskId={projectTask.id}
        onClose={() => {
          setIsAssignMembersVisible(false);
        }}
        projectId={projectTask.projectId}
      />
      <EditProjectTaskWindow
        visible={isEditProjectTaskVisible}
        onClose={() => {
          setIsEditProjectTaskVisible(false);
        }}
        projectId={projectTask.projectId}
        projectTask={projectTask}
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
    padding: 10,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ProjectTask;
