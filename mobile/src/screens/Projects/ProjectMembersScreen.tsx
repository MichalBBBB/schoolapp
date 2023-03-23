import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useLayoutEffect, useState} from 'react';
import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {AddProjectMemberWindow} from '../../components/addProjectMemberWindow';
import BasicInputWindow from '../../components/basicInputWindow';
import {BasicButton} from '../../components/basicViews/BasicButton';
import {BasicLoading} from '../../components/basicViews/BasicLoading';
import {BasicText} from '../../components/basicViews/BasicText';
import {
  useAddMemberToProjectMutation,
  useGetProjectsQuery,
  useRemoveMemberFromProjectMutation,
} from '../../generated/graphql';
import {ProjectStackScreenProps} from '../../utils/types';

export const ProjectMembersScreen: React.FC<
  ProjectStackScreenProps<'ProjectMembersScreen'>
> = ({navigation, route}) => {
  // we get the project this way to make it reactive to changes
  const {data} = useGetProjectsQuery();
  const project = data?.getProjects.find(item => {
    return item.id == route.params.projectId;
  });
  const [removeMember] = useRemoveMemberFromProjectMutation({
    context: {skipQeue: true},
  });
  const [addMember] = useAddMemberToProjectMutation();
  const [addProjectMemberWindowVisible, setAddProjectMemberWindowVisible] =
    useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <BasicButton
          variant="unstyled"
          onPress={() => {
            setAddProjectMemberWindowVisible(true);
          }}>
          <BasicText>Add</BasicText>
        </BasicButton>
      ),
    });
  });

  if (!project) {
    return (
      <View>
        <BasicLoading />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <BasicText textVariant="title">Members</BasicText>
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
      <BasicInputWindow
        visible={addProjectMemberWindowVisible}
        onClose={() => {
          setAddProjectMemberWindowVisible(false);
        }}
        onSubmit={value => {
          addMember({variables: {projectId: project?.id, memberEmail: value}});
        }}
        buttonText={'Invite'}
        placeholder="Email"
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
