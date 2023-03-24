import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useLayoutEffect, useState} from 'react';
import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {AddProjectMemberWindow} from '../../components/addProjectMemberWindow';
import BasicInputWindow from '../../components/basicInputWindow';
import {BasicButton} from '../../components/basicViews/BasicButton';
import {BasicIcon} from '../../components/basicViews/BasicIcon';
import {BasicLoading} from '../../components/basicViews/BasicLoading';
import {BasicText} from '../../components/basicViews/BasicText';
import {Menu} from '../../components/menu';
import {MenuItem} from '../../components/menu/MenuItem';
import {Popup} from '../../components/popup';
import {useTheme} from '../../contexts/ThemeContext';
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

  const [theme] = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: project?.name,
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
          style={{marginTop: 10}}
          contentContainerStyle={{
            borderRadius: 15,
            overflow: 'hidden',
            backgroundColor: theme.colors.accentBackground1,
            padding: 5,
          }}
          data={project?.members}
          renderItem={({item, index}) => (
            <View
              key={index}
              style={[
                styles.memberContainer,
                {backgroundColor: theme.colors.accentBackground1},
              ]}>
              <View style={{flexDirection: 'row'}}>
                <BasicText>{item.name}</BasicText>
                {item.isAdmin && (
                  <BasicText color="textSecondary" style={{marginLeft: 10}}>
                    Admin
                  </BasicText>
                )}
              </View>
              {!item.isAdmin && (
                <Popup
                  trigger={
                    <Pressable>
                      <BasicIcon
                        source={require('../../../assets/Options.png')}
                        style={{height: 20, width: 20}}
                      />
                    </Pressable>
                  }>
                  <Menu>
                    <MenuItem
                      color="dangerous"
                      text="Remove member"
                      onPress={() => {
                        removeMember({
                          variables: {
                            memberId: item.id,
                            projectId: route.params.projectId,
                          },
                        });
                      }}
                    />
                  </Menu>
                </Popup>
              )}
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
  },
  deleteButton: {
    resizeMode: 'stretch',
    height: 25,
    width: 25,
    tintColor: '#ccc',
  },
  memberContainer: {
    padding: 8,
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
