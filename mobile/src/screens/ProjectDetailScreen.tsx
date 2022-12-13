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
import BasicInputWindow from '../components/basicInputWindow';
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

  useEffect(() => {
    console.log(JSON.stringify(error));
    console.log(project?.tasks);
  }, [error, project]);

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
            <View>
              <Text>{item.name}</Text>
            </View>
          )}
        />
      </View>
      <BasicInputWindow
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
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
