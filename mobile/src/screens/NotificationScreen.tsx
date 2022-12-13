import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {BasicButton} from '../components/basicViews/BasicButton';
import {BasicCard} from '../components/basicViews/BasicCard';
import {
  GetInvitesDocument,
  GetProjectsDocument,
  useAcceptProjectInviteMutation,
  useDeclineProjectInviteMutation,
  useGetInvitesQuery,
} from '../generated/graphql';
import {TaskStackParamList} from '../routes/TaskStack';

export const NotificationScreen: React.FC<
  NativeStackScreenProps<TaskStackParamList, 'NotificationScreen'>
> = () => {
  const {data} = useGetInvitesQuery();
  const [acceptProject] = useAcceptProjectInviteMutation();
  const [declineProject] = useDeclineProjectInviteMutation();
  return (
    <View>
      <FlatList
        data={data?.getInvites}
        renderItem={({item}) => (
          <View style={{margin: 5}}>
            <BasicCard backgroundColor="#eee">
              <Text style={{marginBottom: 5, fontSize: 16}}>
                {`${item.ownerName} has invited you to join the project ${item.projectName}`}
              </Text>
              <View style={styles.buttonContainer}>
                <BasicButton
                  onPress={() => {
                    acceptProject({
                      variables: {id: item.projectId},
                      refetchQueries: [GetInvitesDocument, GetProjectsDocument],
                    });
                  }}
                  padding={10}
                  backgroundColor="white"
                  style={{marginRight: 5}}>
                  <Text>Accept</Text>
                </BasicButton>
                <BasicButton
                  onPress={() => {
                    declineProject({
                      variables: {id: item.projectId},
                      refetchQueries: [GetInvitesDocument],
                    });
                  }}
                  padding={10}
                  backgroundColor="white">
                  <Text>Decline</Text>
                </BasicButton>
              </View>
            </BasicCard>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
  },
});
