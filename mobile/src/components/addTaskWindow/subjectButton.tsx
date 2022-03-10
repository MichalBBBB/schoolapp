import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, FlatList} from 'react-native';
import {SubjectFragment, useGetAllSubjectsQuery} from '../../generated/graphql';

const SubjectButton: React.FC<{
  onChangeSubject: (subject: SubjectFragment) => void;
  onAddSubject: () => void;
}> = ({onChangeSubject, onAddSubject}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {data} = useGetAllSubjectsQuery();
  const [subject, setSubject] = useState<SubjectFragment | null>(null);
  return (
    <TouchableOpacity
      style={{
        flex: 1,
        marginRight: 10,
        height: '100%',
      }}
      onPress={() => {
        setIsOpen(true);
      }}>
      <View style={[styles.button, {height: isOpen ? undefined : '100%'}]}>
        {isOpen ? (
          <View>
            <FlatList
              contentContainerStyle={{alignItems: 'center'}}
              data={data?.getAllSubjects}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={{marginBottom: 10}}
                  onPress={() => {
                    setIsOpen(false);
                    setSubject(item);
                    onChangeSubject(item);
                  }}>
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={{
                paddingHorizontal: 30,
                padding: 5,
                backgroundColor: '#ddd',
                borderRadius: 10,
              }}
              onPress={() => {
                onAddSubject();
              }}>
              <Text>Add</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text>{subject ? subject.name : 'Subject'}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#EEE',
    padding: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});

export default SubjectButton;
