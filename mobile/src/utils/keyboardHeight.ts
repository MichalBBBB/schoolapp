import {useState, useEffect} from 'react';
import {Keyboard, Platform} from 'react-native';

export const isIOS = Platform.OS === 'ios';
const useKeyboardHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const handleKeyboardDidShow = (e: any) => {
    setKeyboardHeight(e.endCoordinates.height);
  };
  const handleKeyboardDidHide = () => {
    setKeyboardHeight(0);
  };

  useEffect(() => {
    // keyboardWillShow is not supported on android
    const showEvent = isIOS ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = isIOS ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, handleKeyboardDidShow);
    const hideSub = Keyboard.addListener(hideEvent, handleKeyboardDidHide);
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return {keyboardHeight};
};

export default useKeyboardHeight;
