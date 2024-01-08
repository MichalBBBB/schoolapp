import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';
import {BasicText} from './basicViews/BasicText';

interface addButtonProps {
  onPress?: () => void;
}

const AddButton: React.FC<addButtonProps> = ({onPress}) => {
  const [theme] = useTheme();
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          backgroundColor: theme.colors.accent,
          borderRadius: 20,
          padding: 10,
          paddingHorizontal: 20,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <BasicText color="textContrast" style={{fontWeight: 'bold'}}>
          Add
        </BasicText>
      </View>
    </TouchableOpacity>
  );
};

export default AddButton;
