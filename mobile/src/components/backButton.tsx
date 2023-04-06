import React from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';
import {BasicIcon} from './basicViews/BasicIcon';

const BackButton: React.FC<{onPress: () => void}> = ({onPress}) => {
  return (
    <TouchableOpacity onPress={() => onPress()} style={{paddingRight: 10}}>
      <BasicIcon
        source={require('../../assets/Chevron-left.png')}
        style={styles.button}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    resizeMode: 'stretch',
    width: 25,
    height: 25,
  },
});
export default BackButton;
