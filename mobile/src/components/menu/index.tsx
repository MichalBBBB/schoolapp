import React, {useState, useEffect, useRef, useMemo, createRef} from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableOpacity,
  Text,
  StatusBar,
  NativeModules,
  LayoutAnimation,
  Easing,
} from 'react-native';
import {Portal} from '@gorhom/portal';
import useKeyboardHeight, {isIOS} from '../../utils/keyboardHeight';
import Animated, {BounceIn} from 'react-native-reanimated';

const {width: layoutWidth, height: layoutHeight} = Dimensions.get('window');

interface MenuProps {
  trigger: React.ReactNode;
}

export const Menu: React.FC<MenuProps> = ({trigger, children}) => {
  const triggerWrapperRef = useRef<View>(null);
  const itemsWrapperRef = useRef<Animated.View>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const [triggerDimensions, setTriggerDimensions] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });
  const [modalDimensions, setModalDimensions] = useState({
    width: 0,
    height: 0,
  });

  const {keyboardHeight} = useKeyboardHeight();

  useEffect(() => {
    console.log(menuVisible, modalDimensions.height, modalDimensions.width);
  }, [modalDimensions]);

  const styles = StyleSheet.create({
    modalWrapper: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 10,
    },

    button: {
      width: 'auto',
      alignSelf: 'center',
    },
    activeSection: {
      backgroundColor: 'white',
      alignSelf: 'flex-start',
      padding: 5,
      ...Platform.select({
        ios: {
          alignSelf: 'flex-start',
          width: layoutWidth * 0.5,

          borderRadius: 13,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 1,
          shadowRadius: 100,
        },
        android: {
          maxWidth: layoutWidth * 0.7,
          alignSelf: 'flex-start',
          elevation: 8,
        },
      }),
      opacity:
        modalDimensions.width !== 0 && triggerDimensions.left !== 0 ? 1 : 0,
      zIndex: 99,
    },
    overlay: {
      ...Platform.select({
        ios: {
          borderRadius: 13,
        },
      }),
    },
  });

  const calculateDimensions = () => {
    triggerWrapperRef?.current?.measureInWindow((x, y, width, height) => {
      setTriggerDimensions({
        top: Math.max(y, 0),
        left: x,
        width,
        height,
      });
    });

    setTimeout(() => {
      itemsWrapperRef?.current?.measureInWindow((x, y, width, height) => {
        setModalDimensions({width, height});
      });
    }, 100);
  };

  useEffect(() => {
    if (menuVisible) {
      if (triggerWrapperRef?.current) calculateDimensions();
    }
  }, [menuVisible, itemsWrapperRef, setModalDimensions]);

  const closeModal = () => {
    setMenuVisible(false);
    setModalDimensions({width: 0, height: 0});
    setTriggerDimensions({top: 0, left: 0, width: 0, height: 0});
  };

  const {top, left} = useMemo(() => {
    let left = 0;
    let top = 0;

    left =
      triggerDimensions.left - modalDimensions.width + triggerDimensions.width;
    // if the popup is outside the screen from the left
    if (triggerDimensions.left - modalDimensions.width < 0)
      left = triggerDimensions.left;

    if (isIOS) {
      const initialTriggerTop =
        triggerDimensions.top + triggerDimensions.height + 10;
      if (
        modalDimensions.height + initialTriggerTop >
        layoutHeight - keyboardHeight
      )
        top = triggerDimensions.top - modalDimensions.height - 10;
      else top = initialTriggerTop;
    } else {
      const initialTriggerTop =
        triggerDimensions.top +
        triggerDimensions.height +
        NativeModules.StatusBarManager.HEIGHT;

      top =
        initialTriggerTop + modalDimensions.height >
        layoutHeight - keyboardHeight
          ? initialTriggerTop -
            triggerDimensions.height -
            modalDimensions.height
          : initialTriggerTop;
    }

    return {top, left};
  }, [modalDimensions, triggerDimensions, keyboardHeight]);

  const menuPositionStyles = {left, top};

  return (
    <>
      <Pressable
        onPress={() => {
          setMenuVisible(true);
        }}
        ref={triggerWrapperRef}>
        {trigger}
      </Pressable>
      <Portal hostName="menu">
        {menuVisible && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={closeModal}
            style={styles.modalWrapper}>
            <Animated.View
              style={[styles.activeSection, menuPositionStyles]}
              collapsable={false}
              ref={itemsWrapperRef}>
              {/* pass the closeModal to children prop  */}
              {Array.isArray(children)
                ? children.map((childrenItem, index) => {
                    return React.cloneElement(childrenItem, {
                      closeModal,
                      key: index,
                    });
                  })
                : React.cloneElement(children as any, {
                    closeModal,
                  })}
            </Animated.View>
          </TouchableOpacity>
        )}
      </Portal>
    </>
  );
};
