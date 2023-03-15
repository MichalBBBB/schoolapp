import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useLayoutEffect} from 'react';
import {FlatList, Pressable, Text, View} from 'react-native';
import {BaseButton} from 'react-native-gesture-handler';
import {BasicButton} from '../../components/basicViews/BasicButton';
import {BasicCard} from '../../components/basicViews/BasicCard';
import {BasicText} from '../../components/basicViews/BasicText';
import {Invite} from '../../components/invite';
import {Project} from '../../components/project';
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
import {ProjectStackParamList} from '../../routes/ProjectStack';

const ProjectHomeScreen: React.FC<
  NativeStackScreenProps<ProjectStackParamList, 'ProjectHomeScreen'>
> = ({navigation}) => {
  const {data, error} = useGetProjectsQuery();
  const {data: invites} = useGetInvitesQuery();
  const [deleteProject, {error: deleteError}] = useDeleteProjectMutation({
    context: {skipQeue: true},
  });

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
