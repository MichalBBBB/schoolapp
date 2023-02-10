import React from 'react';
import {StyleSheet, View} from 'react-native';
import {BasicCard} from './basicViews/BasicCard';

interface ConnectedListProps {
  bottomMargin?: number | undefined;
}

const ConnectedList: React.FC<ConnectedListProps> = ({
  bottomMargin,
  children,
}) => {
  return (
    <BasicCard
      spacing="none"
      backgroundColor="accentBackground"
      style={{marginBottom: bottomMargin}}>
      {children}
    </BasicCard>
  );
};

export default ConnectedList;
