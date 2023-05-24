import {useReactiveVar} from '@apollo/client';
import React, {useEffect} from 'react';
import {createContext, useContext, useState} from 'react';
import {View} from 'react-native';
import Purchases, {PurchasesPackage} from 'react-native-purchases';
import {isLoadingVar} from '../App';
import {BasicButton} from '../components/basicViews/BasicButton';
import {BasicModalCard} from '../components/basicViews/BasicModalCard';
import {BasicText} from '../components/basicViews/BasicText';
import {packagesVar} from '../Content';
import {refreshToken} from '../utils/AccessToken';

const PremiumWindowContext = createContext<() => void>(() => {});

export const usePremiumWindow = () => {
  const value = useContext(PremiumWindowContext);
  return value;
};

export const PremiumWindowProvider: React.FC<{}> = ({children}) => {
  const [windowVisible, setWindowVisible] = useState(false);
  const packages = useReactiveVar(packagesVar);

  const showWindow = () => {
    setWindowVisible(true);
  };

  const purchase = async (item: PurchasesPackage) => {
    try {
      await Purchases.purchasePackage(item);
      await refreshToken();
      setWindowVisible(false);
    } catch (err) {
      console.log(err);
    }
  };

  const restore = async () => {
    try {
      isLoadingVar(true);
      const restore = await Purchases.restorePurchases();
      console.log(restore);
      await refreshToken();
      setWindowVisible(false);
    } catch (err) {
      console.log(err);
    }
    isLoadingVar(false);
  };

  return (
    <PremiumWindowContext.Provider value={showWindow}>
      <>
        <BasicModalCard
          spacing="m"
          onBackdropPress={() => {
            setWindowVisible(false);
          }}
          isVisible={windowVisible}
          alignCard="center">
          <BasicText
            textVariant="heading"
            style={{textAlign: 'center', marginVertical: 10}}>
            Try Premium!
          </BasicText>
          <View style={{margin: 10, marginLeft: 25}}>
            <BasicText style={{marginBottom: 5}}>
              Add unlimited number of tasks
            </BasicText>
            <BasicText style={{marginBottom: 5}}>
              Create group projects
            </BasicText>
            <BasicText style={{marginBottom: 5}}>
              Get advanced timetable options
            </BasicText>
            <BasicText style={{marginBottom: 5}}>Add more schedules</BasicText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
            }}>
            {packages.map((item, index) => (
              <BasicButton
                key={index}
                onPress={() => {
                  purchase(item);
                }}
                borderWidth={1}
                style={{flex: 1, marginHorizontal: 4}}
                variant="outlined">
                <BasicText
                  style={{textAlign: 'center'}}
                  textVariant="subHeading">
                  {item.product.title}
                </BasicText>
                <BasicText style={{textAlign: 'center'}}>
                  2 weeks free
                </BasicText>
                <BasicText
                  style={{textAlign: 'center'}}
                  textVariant={'heading'}>
                  {item.product.priceString}
                </BasicText>
              </BasicButton>
            ))}
          </View>
          <View>
            <BasicButton
              variant="unstyled"
              spacing="m"
              onPress={() => {
                restore();
              }}>
              <BasicText style={{textDecorationLine: 'underline'}}>
                Restore purchases
              </BasicText>
            </BasicButton>
          </View>
        </BasicModalCard>
        {children}
      </>
    </PremiumWindowContext.Provider>
  );
};
