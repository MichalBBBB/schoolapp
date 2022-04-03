import React, {useState} from 'react';
import {Modal, View} from 'react-native';
import BackgroundPress from './backgroundPress';

interface PopupProps {
  open: boolean;
  onClose: () => void;
  width?: number | undefined;
}

const Popup: React.FC<PopupProps> = ({open, onClose, children, width}) => {
  const [height, setHeight] = useState(0);
  const findDimensions = ({height}: {height: number}) => {
    setHeight(height);
  };
  return (
    <Modal transparent={true} visible={open}>
      <BackgroundPress onPress={onClose} />
      <View
        style={{
          width: width,
          position: 'absolute',
          alignSelf: 'center',
          top: '50%',
          marginTop: -(height / 2),
        }}
        onLayout={event => {
          findDimensions(event.nativeEvent.layout);
        }}>
        {children}
      </View>
    </Modal>
  );
};

export default Popup;
