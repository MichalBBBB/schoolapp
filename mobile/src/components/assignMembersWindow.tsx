import React, {useEffect} from 'react';
import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {
  GetProjectTasksOfUserDocument,
  ProjectFragment,
  useAssignMemberMutation,
  useGetProjectsQuery,
  useRemoveAssignedMemberMutation,
} from '../generated/graphql';
import {BasicButton} from './basicViews/BasicButton';
import {BasicModalCard} from './basicViews/BasicModalCard';
import {BasicText} from './basicViews/BasicText';

interface AssignMembersWindow {
  isVisible: boolean;
  projectId: string;
  taskId?: string | null;
  onClose: () => void;
}

export const AssignMembersWindow: React.FC<AssignMembersWindow> = ({
  isVisible,
  projectId,
  onClose,
  taskId,
}) => {
  const [assignMember] = useAssignMemberMutation();
  const [removeAssignedMember] = useRemoveAssignedMemberMutation();
  const {data: projects} = useGetProjectsQuery();
  const project = projects?.getProjects.find(item => {
    return item.id == projectId;
  });
  const task = project?.tasks.find(item => {
    return item.id == taskId;
  });
  if (!taskId && isVisible) {
    return (
      <View>
        <Text>No task was selected</Text>
      </View>
    );
  }

  return (
    <BasicModalCard
      spacing="l"
      isVisible={isVisible}
      alignCard={'center'}
      onBackdropPress={() => {
        onClose();
      }}>
      <View>
        <BasicText textVariant="heading">Assigned people</BasicText>
        <View style={{padding: 10}}>
          {task?.publicUsers && task.publicUsers.length > 0 ? (
            task?.publicUsers.map((item, index) => (
              <View key={index} style={styles.userContainer}>
                <BasicText>{item.name}</BasicText>
                <BasicButton
                  spacing="none"
                  variant="unstyled"
                  onPress={() => {
                    removeAssignedMember({
                      variables: {userId: item.id, taskId: taskId!},
                    });
                  }}>
                  <Image
                    source={require('../../assets/Delete.png')}
                    style={styles.plusButton}
                  />
                </BasicButton>
              </View>
            ))
          ) : (
            <BasicText>No users assigned</BasicText>
          )}
        </View>
        <View style={{paddingHorizontal: 10, marginBottom: 10}}>
          <View
            style={{
              width: '100%',
              height: 1,
              borderRadius: 1,
              backgroundColor: '#ddd',
            }}
          />
        </View>
        <FlatList
          data={project?.members.filter(member => {
            return !task?.publicUsers.some(item => {
              return member.id == item.id;
            });
          })}
          renderItem={({item}) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
              }}>
              <BasicText>{item.name}</BasicText>
              <BasicButton
                variant="unstyled"
                spacing="none"
                onPress={() => {
                  assignMember({
                    variables: {userId: item.id, taskId: taskId!},
                    refetchQueries: [GetProjectTasksOfUserDocument],
                  });
                }}>
                <Image
                  source={require('../../assets/Plus.png')}
                  style={styles.plusButton}
                />
              </BasicButton>
            </View>
          )}
        />
      </View>
    </BasicModalCard>
  );
};

const styles = StyleSheet.create({
  plusButton: {
    resizeMode: 'stretch',
    height: 25,
    width: 25,
    tintColor: '#ccc',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
