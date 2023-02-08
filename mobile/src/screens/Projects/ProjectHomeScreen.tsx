import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {FlatList, Pressable, Text, View} from 'react-native';
import {BaseButton} from 'react-native-gesture-handler';
import {BasicCard} from '../../components/basicViews/BasicCard';
import {
  GetProjectsDocument,
  useDeleteProjectMutation,
  useGetProjectsQuery,
} from '../../generated/graphql';
import {ProjectStackParamList} from '../../routes/ProjectStack';

const ProjectHomeScreen: React.FC<
  NativeStackScreenProps<ProjectStackParamList, 'ProjectHomeScreen'>
> = ({navigation}) => {
  const {data, error} = useGetProjectsQuery();
  const [deleteProject, {error: deleteError}] = useDeleteProjectMutation();
  useEffect(() => {
    console.log(JSON.stringify(error), JSON.stringify(deleteError));
  }, [error, deleteError]);
  return (
    <View>
      <FlatList
        data={data?.getProjects}
        renderItem={({item}) => (
          <View style={{margin: 5}}>
            <Pressable
              onPress={() => {
                navigation.navigate('ProjectDetailScreen', {
                  projectId: item.id,
                });
              }}>
              <BasicCard backgroundColor="#eee">
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text>{item.name}</Text>
                  <BaseButton
                    onPress={() =>
                      deleteProject({
                        variables: {id: item.id},
                        refetchQueries: [GetProjectsDocument],
                      })
                    }>
                    <Text style={{color: 'red'}}>Delete</Text>
                  </BaseButton>
                </View>
              </BasicCard>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
};

export default ProjectHomeScreen;
