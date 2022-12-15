import React, {useEffect} from 'react';
import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {
  ProjectFragment,
  useAssignMemberMutation,
  useRemoveAssignedMemberMutation,
} from '../generated/graphql';
import {BasicModalCard} from './basicViews/BasicModalCard';

interface AssignMembersWindow {
  isVisible: boolean;
  project: ProjectFragment;
  taskId?: string | null;
  onClose: () => void;
}

export const AssignMembersWindow: React.FC<AssignMembersWindow> = ({
  isVisible,
  project,
  onClose,
  taskId,
}) => {
  const [assignMember] = useAssignMemberMutation();
  const [removeAssignedMember] = useRemoveAssignedMemberMutation();
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
      isVisible={isVisible}
      alignCard={'center'}
      onBackdropPress={() => {
        onClose();
      }}>
      <View>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Assigned people</Text>
        <View style={{padding: 10}}>
          {task?.publicUsers && task.publicUsers.length > 0 ? (
            task?.publicUsers.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text>{item.name}</Text>
                <Pressable
                  onPress={() => {
                    removeAssignedMember({
                      variables: {userId: item.id, taskId: taskId!},
                    });
                  }}>
                  <Image
                    source={require('../../assets/Delete.png')}
                    style={styles.plusButton}
                  />
                </Pressable>
              </View>
            ))
          ) : (
            <Text>No users assigned</Text>
          )}
        </View>
        <View style={{paddingHorizontal: 10, marginBottom: 10}}>
          <View
            style={{
              width: '100%',
              height: 2,
              borderRadius: 1,
              backgroundColor: '#ddd',
            }}
          />
        </View>
        <FlatList
          data={project.members.filter(member => {
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
              <Text>{item.name}</Text>
              <Pressable
                onPress={() => {
                  assignMember({variables: {userId: item.id, taskId: taskId!}});
                }}>
                <Image
                  source={require('../../assets/Plus.png')}
                  style={styles.plusButton}
                />
              </Pressable>
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
});
