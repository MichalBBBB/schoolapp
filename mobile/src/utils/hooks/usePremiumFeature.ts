import Purchases from 'react-native-purchases';
import {usePremiumWindow} from '../../contexts/PremiumWindowContext';

export const usePremiumFeature = () => {
  const showPremiumWindow = usePremiumWindow();
  return (callback: () => void) => {
    Purchases.getCustomerInfo().then(result => {
      if (result.entitlements.active['premium']) {
        // callback();
        showPremiumWindow();
      } else {
        showPremiumWindow();
      }
    });
  };
};
