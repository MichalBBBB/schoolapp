import {useApolloClient} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import {FlatList, Pressable, Text, View} from 'react-native';
import {BaseButton} from 'react-native-gesture-handler';
import {BasicButton} from '../../components/basicViews/BasicButton';
import {BasicCard} from '../../components/basicViews/BasicCard';
import {BasicText} from '../../components/basicViews/BasicText';
import {Invite} from '../../components/invite';
import {Project} from '../../components/project';
import {replaceAllData} from '../../Content';
import {
  GetInvitesDocument,
  GetProjectsDocument,
  InviteFragment,
  ProjectFragment,
  useAcceptProjectInviteMutation,
  useDeclineProjectInviteMutation,
  useDeleteProjectMutation,
  useGetInvitesQuery,
  useGetProjectsQuery,
} from '../../generated/graphql';
import {ProjectStackScreenProps} from '../../utils/types';

const ProjectHomeScreen: React.FC<
  ProjectStackScreenProps<'ProjectHomeScreen'>
> = ({navigation}) => {
  const {data, error} = useGetProjectsQuery();
  const {data: invites} = useGetInvitesQuery();
  const [deleteProject, {error: deleteError}] = useDeleteProjectMutation({
    context: {skipQeue: true},
  });

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
            navigation.navigate('NewProjectScreen');
          }}>
          <BasicText>Add</BasicText>
        </BasicButton>
      ),
    });
  });

  const MyFlatList = FlatList<ProjectFragment | InviteFragment>;

  return (
    <View style={{padding: 10}}>
      <MyFlatList
        contentContainerStyle={{flexGrow: 1}}
        style={{height: '100%'}}
        ListEmptyComponent={() => (
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
        )}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          replaceAllData(client).then(() => {
            setRefreshing(false);
          });
        }}
        data={[...(invites?.getInvites || []), ...(data?.getProjects || [])]}
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
  );
};

export default ProjectHomeScreen;
