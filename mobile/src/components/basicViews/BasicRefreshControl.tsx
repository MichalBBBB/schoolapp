import React from 'react';
import {RefreshControl, RefreshControlProps} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';

export const BasicRefreshControl: React.FC<RefreshControlProps> = ({
  onRefresh,
  refreshing,
  ...props
}) => {
  const [theme] = useTheme();
  return (
    <RefreshControl
      onRefresh={onRefresh}
      refreshing={refreshing}
      tintColor={theme.colors.textSecondary}
      colors={[theme.colors.textSecondary]}
      {...props}
    />
  );
};
