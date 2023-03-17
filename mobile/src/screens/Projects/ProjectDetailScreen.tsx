import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AssignMembersWindow} from '../../components/assignMembersWindow';
import {BasicIcon} from '../../components/basicViews/BasicIcon';
import {BasicText} from '../../components/basicViews/BasicText';
import EditProjectTaskWindow from '../../components/editProjectTaskWindow';
import {Menu} from '../../components/menu';
import {MenuItem} from '../../components/menu/MenuItem';
import {Popup} from '../../components/popup';
import ProjectTask from '../../components/projectTask';
import {useTheme} from '../../contexts/ThemeContext';
import {
  GetProjectsDocument,
  useAddProjectTaskMutation,
  useGetProjectsQuery,
} from '../../generated/graphql';
import {ProjectStackParamList} from '../../routes/ProjectStack';

const ProjectDetailScreen: React.FC<
  NativeStackScreenProps<ProjectStackParamList, 'ProjectDetailScreen'>
> = ({route, navigation}) => {
  const {data: projects} = useGetProjectsQuery();

  const project = projects?.getProjects.find(
    item => item.id == route.params.projectId,
  );
  const [addTaskModalIsVisible, setAddTaskModalIsVisible] = useState(false);
  const [theme] = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: project?.name,
      headerRight: () => (
        <Popup
          trigger={
            <Pressable>
              <BasicIcon
                source={require('../../../assets/Options.png')}
                style={styles.options}
              />
            </Pressable>
          }>
          <Menu>
            <MenuItem
              text={'Members'}
              onPress={() =>
                navigation.navigate('ProjectMembersScreen', {
                  projectId: route.params.projectId,
                })
              }
            />
          </Menu>
        </Popup>
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
          <BasicText textVariant="title">{project?.name}</BasicText>
          <TouchableOpacity
            onPress={() => {
              setAddTaskModalIsVisible(true);
            }}>
            <BasicIcon
              source={require('../../../assets/Plus.png')}
              style={styles.plusButton}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          contentContainerStyle={{
            borderRadius: 15,
            overflow: 'hidden',
            backgroundColor: theme.colors.accentBackground1,
          }}
          data={project?.tasks}
          renderItem={({item}) => (
            <ProjectTask
              projectTask={item}
              backgroundColor={'accentBackground1'}
            />
          )}
        />
      </View>
      <EditProjectTaskWindow
        projectId={project.id}
        visible={addTaskModalIsVisible}
        onClose={() => {
          setAddTaskModalIsVisible(false);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  container: {
    margin: 10,
    marginHorizontal: 20,
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
