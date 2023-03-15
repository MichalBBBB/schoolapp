import React from 'react';
import {View} from 'react-native';
import {
  GetInvitesDocument,
  GetProjectsDocument,
  InviteFragment,
  useAcceptProjectInviteMutation,
  useDeclineProjectInviteMutation,
} from '../generated/graphql';
import {BasicButton} from './basicViews/BasicButton';
import {BasicCard} from './basicViews/BasicCard';
import {BasicText} from './basicViews/BasicText';

interface InviteProps {
  invite: InviteFragment;
}

export const Invite: React.FC<InviteProps> = ({invite}) => {
  const [acceptProject] = useAcceptProjectInviteMutation({
    context: {
      skipQeue: true,
    },
    refetchQueries: [GetProjectsDocument],
  });
  const [declineProject] = useDeclineProjectInviteMutation({
    context: {
      skipQueue: true,
    },
    refetchQueries: [GetProjectsDocument],
  });
  return (
    <View style={{margin: 5}}>
      <BasicCard backgroundColor="accentBackground" spacing="m">
        <BasicText style={{marginBottom: 5}}>
          {`${invite.ownerName} has invited you to join the project ${invite.projectName}`}
        </BasicText>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-around',
          }}>
          <BasicButton
            onPress={() => {
              acceptProject({
                variables: {id: invite.projectId},
                refetchQueries: [GetInvitesDocument, GetProjectsDocument],
              });
            }}
            spacing="m"
            backgroundColor="background"
            style={{flex: 1, marginRight: 4}}>
            <BasicText>Accept</BasicText>
          </BasicButton>
          <BasicButton
            onPress={() => {
              declineProject({
                variables: {id: invite.projectId},
                refetchQueries: [GetInvitesDocument],
              });
            }}
            spacing="m"
            backgroundColor="background"
            style={{flex: 1, marginLeft: 4}}>
            <BasicText>Decline</BasicText>
          </BasicButton>
        </View>
      </BasicCard>
    </View>
  );
};
