import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BackButton from '../../components/backButton';
import {BasicIcon} from '../../components/basicViews/BasicIcon';
import {BasicTextInput} from '../../components/basicViews/BasicTextInput';
import EditProjectTaskWindow from '../../components/editProjectTaskWindow';
import {Menu} from '../../components/menu';
import {MenuItem} from '../../components/menu/MenuItem';
import {Popup} from '../../components/popup';
import ProjectTask from '../../components/projectTask';
import {useTheme} from '../../contexts/ThemeContext';
import {useGetProjectsQuery} from '../../generated/graphql';
import {useDeleteProject} from '../../mutationHooks/project/deleteProject';
import {useEditProject} from '../../mutationHooks/project/editProject';
import {ProjectStackScreenProps} from '../../utils/types';

const ProjectDetailScreen: React.FC<
  ProjectStackScreenProps<'ProjectDetailScreen'>
> = ({route, navigation}) => {
  const {data: projects} = useGetProjectsQuery();
  const [editProject] = useEditProject();
  const [deleteProject] = useDeleteProject();

  const project = projects?.getProjects.find(
    item => item.id == route.params.projectId,
  );
  const [addTaskModalIsVisible, setAddTaskModalIsVisible] = useState(false);
  const [theme] = useTheme();

  const [text, setText] = useState(project?.text);
  const [name, setName] = useState(project?.name || '');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: project?.name,
      headerLeft: () => (
        <BackButton
          onPress={() => {
            navigation.goBack();
            if (project) {
              editProject({
                id: project?.id,
                name,
                text,
              });
            }
          }}
        />
      ),
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
            <MenuItem
              text={'Delete project'}
              color="dangerous"
              onPress={() => {
                if (project) {
                  deleteProject({id: project.id});
                  navigation.goBack();
                }
              }}
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
          <BasicTextInput
            style={{flex: 1}}
            spacing="none"
            textVariant="title"
            variant="unstyled"
            onChangeText={setName}
            defaultValue={project.name}
            onEndEditing={() => {
              editProject({
                id: project.id,
                name,
                text,
              });
            }}
          />

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
        <BasicTextInput
          placeholder="Description"
          variant="unstyled"
          multiline={true}
          onChangeText={setText}
          defaultValue={project.text || ''}
          onEndEditing={() => {
            editProject({
              id: project.id,
              name,
              text,
            });
          }}
        />
        <FlatList
          style={{marginTop: 5}}
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
