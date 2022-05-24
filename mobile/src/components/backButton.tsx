import React from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';

const BackButton: React.FC<{onPress: () => void}> = ({onPress}) => {
  return (
    <TouchableOpacity onPress={() => onPress()}>
      <Image
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
