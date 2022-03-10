import React from 'react';
import {TouchableWithoutFeedback, View} from 'react-native';

interface backgroundPressProps {
  onPress: () => void;
}

const BackgroundPress: React.FC<backgroundPressProps> = ({onPress}) => {
  return (
    <View>
      <TouchableWithoutFeedback onPress={onPress}>
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'black',
            opacity: 0.1,
          }}></View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default BackgroundPress;
