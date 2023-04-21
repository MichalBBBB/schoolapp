import {useApolloClient, useReactiveVar} from '@apollo/client';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {isOnlineVar} from '../../App';
import {BasicButton} from '../../components/basicViews/BasicButton';
import {BasicRefreshControl} from '../../components/basicViews/BasicRefreshControl';
import {BasicText} from '../../components/basicViews/BasicText';
import {Invite} from '../../components/listItems/invite';
import {Project} from '../../components/listItems/project';
import {replaceAllData} from '../../Content';
import {useTheme} from '../../contexts/ThemeContext';
import {
  InviteFragment,
  ProjectFragment,
  useDeleteProjectMutation,
  useGetInvitesQuery,
  useGetProjectsQuery,
} from '../../generated/graphql';
import {ProjectStackScreenProps} from '../../utils/types';

const ProjectHomeScreen: React.FC<
  ProjectStackScreenProps<'ProjectHomeScreen'>
> = ({navigation}) => {
  const isOnline = useReactiveVar(isOnlineVar);
  const {data, error} = useGetProjectsQuery();
  const {data: invites} = useGetInvitesQuery();
  const [deleteProject, {error: deleteError}] = useDeleteProjectMutation({
    context: {skipQeue: true},
  });
  const [theme] = useTheme();

  const client = useApolloClient();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log(JSON.stringify(error), JSON.stringify(deleteError));
  }, [error, deleteError]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <BasicButton
          variant="unstyled"
          onPress={() => {
            if (isOnline) {
              navigation.navigate('NewProjectScreen');
            }
          }}>
          <BasicText>Add</BasicText>
        </BasicButton>
      ),
    });
  });

  const MyFlatList = FlatList<ProjectFragment | InviteFragment>;

  const list = isOnline
    ? [...(invites?.getInvites || []), ...(data?.getProjects || [])]
    : [];

  return (
    <>
      <View style={{padding: 10}}>
        <MyFlatList
          contentContainerStyle={{flexGrow: 1}}
          style={{height: '100%'}}
          ListEmptyComponent={() =>
            isOnline ? (
              <View
                style={{
                  height: '100%',
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <BasicText textVariant="heading" style={{marginBottom: 10}}>
                  No projects yet
                </BasicText>
                <BasicButton
                  spacing="m"
                  onPress={() => {
                    navigation.navigate('NewProjectScreen');
                  }}>
                  <BasicText color="textContrast" textVariant="button">
                    Create a new one
                  </BasicText>
                </BasicButton>
              </View>
            ) : (
              <View
                style={{
                  position: 'absolute',
                  height: '100%',
                  width: '100%',
                  backgroundColor: theme.colors.background,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 20,
                }}>
                <BasicText textVariant="title">
                  You are currently offline
                </BasicText>
                <BasicText
                  color="textSecondary"
                  style={{textAlign: 'center', marginTop: 10}}>
                  Projects will be available when you are connected to the
                  internet
                </BasicText>
              </View>
            )
          }
          refreshControl={
            <BasicRefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                replaceAllData(client).then(() => {
                  setRefreshing(false);
                });
              }}
            />
          }
          data={list}
          renderItem={({item}) => {
            if (item.__typename == 'Project') {
              return <Project project={item} />;
            } else if (item.__typename == 'Invite') {
              return <Invite invite={item} />;
            } else {
              return <View></View>;
            }
          }}
        />
      </View>
    </>
  );
};

export default ProjectHomeScreen;
