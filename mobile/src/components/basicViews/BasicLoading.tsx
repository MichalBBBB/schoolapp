import {UIActivityIndicator} from 'react-native-indicators';
import {useTheme} from '../../contexts/ThemeContext';

export const BasicLoading = () => {
  const [theme] = useTheme();
  return <UIActivityIndicator />;
};
