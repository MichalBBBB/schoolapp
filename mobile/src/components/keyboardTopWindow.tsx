import {useHeaderHeight} from '@react-navigation/elements';
import React from 'react';
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import BackgroundPress from './backgroundPress';

const KeyboardTopView: React.FC<{
  children: JSX.Element | JSX.Element[];
  onClose: () => void;
  visible?: boolean;
}> = ({children, onClose, visible = true}) => {
  const headerHeight = useHeaderHeight();
  return (
    <KeyboardAvoidingView
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
        position: 'absolute',
        opacity: visible ? 1 : 0,
      }}
      behavior="position"
      keyboardVerticalOffset={headerHeight}>
      <BackgroundPress onPress={onClose} />
      <View style={{width: '100%', position: 'absolute', bottom: 0}}>
        <View style={{margin: 5}}>
          <View
            style={{
              backgroundColor: 'white',
              width: '100%',
              borderRadius: 15,
              padding: 10,
            }}>
            {children}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default KeyboardTopView;
