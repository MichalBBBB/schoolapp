import React from 'react';
import {StyleSheet, View} from 'react-native';

interface ConnectedListProps {
  bottomMargin?: number | undefined;
}

const ConnectedList: React.FC<ConnectedListProps> = ({
  bottomMargin,
  children,
}) => {
  return (
    <View style={[styles.container, {marginBottom: bottomMargin}]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    backgroundColor: '#eee',
  },
});

export default ConnectedList;
