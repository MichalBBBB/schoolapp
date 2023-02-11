import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {BasicButton} from '../../components/basicViews/BasicButton';
import {BasicCard} from '../../components/basicViews/BasicCard';
import {BasicText} from '../../components/basicViews/BasicText';
import {
  GetInvitesDocument,
  GetProjectsDocument,
  useAcceptProjectInviteMutation,
  useDeclineProjectInviteMutation,
  useGetInvitesQuery,
} from '../../generated/graphql';
import {TaskStackParamList} from '../../routes/TaskStack';

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
            <BasicCard backgroundColor="accentBackground">
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
                  spacing="m"
                  backgroundColor="background"
                  style={{marginRight: 5}}>
                  <BasicText>Accept</BasicText>
                </BasicButton>
                <BasicButton
                  onPress={() => {
                    declineProject({
                      variables: {id: item.projectId},
                      refetchQueries: [GetInvitesDocument],
                    });
                  }}
                  spacing="m"
                  backgroundColor="background">
                  <BasicText>Decline</BasicText>
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
