import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

interface addButtonProps {
  onPress?: () => void;
}

const AddButton: React.FC<addButtonProps> = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          backgroundColor: 'black',
          borderRadius: 20,
          padding: 10,
          paddingHorizontal: 20,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>Add</Text>
      </View>
    </TouchableOpacity>
  );
};

export default AddButton;
