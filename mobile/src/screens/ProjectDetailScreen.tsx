import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AssignMembersWindow} from '../components/assignMembersWindow';
import BasicInputWindow from '../components/basicInputWindow';
import {Menu} from '../components/menu';
import {MenuItem} from '../components/menu/MenuItem';
import ProjectTask from '../components/projectTask';
import {
  GetProjectsDocument,
  useAddProjectTaskMutation,
  useGetProjectsQuery,
} from '../generated/graphql';
import {ProjectStackParamList} from '../routes/ProjectStack';

const ProjectDetailScreen: React.FC<
  NativeStackScreenProps<ProjectStackParamList, 'ProjectDetailScreen'>
> = ({route, navigation}) => {
  const {data: projects} = useGetProjectsQuery();
  const project = projects?.getProjects.find(
    item => item.id == route.params.projectId,
  );
  const [addTaskModalIsVisible, setAddTaskModalIsVisible] = useState(false);
  const [addProjectTask, {error}] = useAddProjectTaskMutation();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Menu
          trigger={
            <Image
              source={require('../../assets/Options.png')}
              style={styles.options}
            />
          }>
          <MenuItem
            text={'Members'}
            onPress={() =>
              navigation.navigate('ProjectMembersScreen', {
                projectId: route.params.projectId,
              })
            }
          />
        </Menu>
      ),
    });
  });

  if (!project) {
    return (
      <View>
        <Text>Project not found</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{project?.name}</Text>
          <TouchableOpacity
            onPress={() => {
              setAddTaskModalIsVisible(true);
            }}>
            <Image
              source={require('../../assets/Plus.png')}
              style={styles.plusButton}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          data={project?.tasks}
          renderItem={({item}) => (
            <ProjectTask
              projectTask={item}
              onUsersPress={() => {
                setActiveTaskId(item.id);
              }}
            />
          )}
        />
      </View>
      <BasicInputWindow
        placeholder="Task name"
        visible={addTaskModalIsVisible}
        onClose={() => {
          setAddTaskModalIsVisible(false);
        }}
        onSubmit={text => {
          addProjectTask({
            variables: {name: text, projectId: project.id},
            refetchQueries: [GetProjectsDocument],
          });
        }}
      />
      <AssignMembersWindow
        isVisible={Boolean(activeTaskId)}
        taskId={activeTaskId}
        onClose={() => {
          setActiveTaskId(null);
        }}
        project={project}
      />
    </>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container: {
    margin: 10,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  plusButton: {
    resizeMode: 'stretch',
    height: 30,
    width: 30,
  },
  options: {
    resizeMode: 'stretch',
    height: 20,
    width: 20,
  },
});

export default ProjectDetailScreen;
