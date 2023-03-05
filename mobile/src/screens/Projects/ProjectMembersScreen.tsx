import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {AddProjectMemberWindow} from '../../components/addProjectMemberWindow';
import {BasicButton} from '../../components/basicViews/BasicButton';
import {BasicText} from '../../components/basicViews/BasicText';
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
  const [removeMember] = useRemoveMemberFromProjectMutation({
    context: {skipQeue: true},
  });
  const [addProjectMemberWindowVisible, setAddProjectMemberWindowVisible] =
    useState(false);
  return (
    <>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <BasicText textVariant="title">{project?.name}</BasicText>
          <BasicButton
            spacing="s"
            variant="outlined"
            borderWidth={2}
            onPress={() => {
              setAddProjectMemberWindowVisible(true);
            }}>
            <BasicText textVariant="button">Add member</BasicText>
          </BasicButton>
        </View>

        <FlatList
          data={project?.members}
          renderItem={({item, index}) => (
            <View key={index} style={styles.memberContainer}>
              <BasicText>{item.name}</BasicText>
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
    margin: 10,
    marginHorizontal: 20,
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
