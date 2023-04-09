import React from 'react';
import {RefreshControl} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';

interface BasicRefreshControlProps {
  onRefresh: () => void;
  refreshing: boolean;
}

export const BasicRefreshControl: React.FC<BasicRefreshControlProps> = ({
  onRefresh,
  refreshing,
}) => {
  const [theme] = useTheme();
  return (
    <RefreshControl
      onRefresh={onRefresh}
      refreshing={refreshing}
      tintColor={theme.colors.textSecondary}
      colors={[theme.colors.textSecondary]}
    />
  );
};
