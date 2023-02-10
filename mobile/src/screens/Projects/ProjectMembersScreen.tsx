import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {AddProjectMemberWindow} from '../../components/addProjectMemberWindow';
import {BasicButton} from '../../components/basicViews/BasicButton';
import {
  useAddMemberToProjectMutation,
  useGetProjectsQuery,
  useRemoveMemberFromProjectMutation,
} from '../../generated/graphql';
import {ProjectStackParamList} from '../../routes/ProjectStack';

export const ProjectMembersScreen: React.FC<
  NativeStackScreenProps<ProjectStackParamList, 'ProjectMembersScreen'>
> = ({navigation, route}) => {
  const {data} = useGetProjectsQuery();
  const project = data?.getProjects.find(item => {
    return item.id == route.params.projectId;
  });
  const [removeMember] = useRemoveMemberFromProjectMutation();
  const [addProjectMemberWindowVisible, setAddProjectMemberWindowVisible] =
    useState(false);
  return (
    <>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{project?.name}</Text>
          <BasicButton
            padding={8}
            onPress={() => {
              setAddProjectMemberWindowVisible(true);
            }}>
            <Text>Add member</Text>
          </BasicButton>
        </View>

        <FlatList
          data={project?.members}
          renderItem={({item, index}) => (
            <View key={index} style={styles.memberContainer}>
              <Text>{item.name}</Text>
              <Pressable
                onPress={() => {
                  removeMember({
                    variables: {
                      memberId: item.id,
                      projectId: route.params.projectId,
                    },
                  });
                }}>
                <Image
                  source={require('../../../assets/Delete.png')}
                  style={styles.deleteButton}
                />
              </Pressable>
            </View>
          )}
        />
      </View>
      <AddProjectMemberWindow
        projectId={route.params.projectId}
        isVisible={addProjectMemberWindowVisible}
        onClose={() => {
          setAddProjectMemberWindowVisible(false);
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  deleteButton: {
    resizeMode: 'stretch',
    height: 25,
    width: 25,
    tintColor: '#ccc',
  },
  memberContainer: {
    margin: 5,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
