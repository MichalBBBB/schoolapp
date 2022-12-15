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
  const [assignMembersWindowVisible, setAssignMembersWindowVisible] =
    useState(false);
  const [addProjectTask, {error}] = useAddProjectTaskMutation();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setAddTaskModalIsVisible(true);
          }}>
          <Image
            source={require('../../assets/Plus.png')}
            style={styles.plusButton}
          />
        </TouchableOpacity>
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
        <Text style={styles.title}>{project?.name}</Text>
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
});

export default ProjectDetailScreen;
