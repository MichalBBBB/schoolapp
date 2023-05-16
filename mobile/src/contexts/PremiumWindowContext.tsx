import React, {useEffect} from 'react';
import {createContext, useContext, useState} from 'react';
import {View} from 'react-native';
import Purchases, {PurchasesPackage} from 'react-native-purchases';
import {BasicButton} from '../components/basicViews/BasicButton';
import {BasicModalCard} from '../components/basicViews/BasicModalCard';
import {BasicText} from '../components/basicViews/BasicText';

const PremiumWindowContext = createContext<() => void>(() => {});

export const usePremiumWindow = () => {
  const value = useContext(PremiumWindowContext);
  return value;
};

export const PremiumWindowProvider: React.FC<{}> = ({children}) => {
  const [windowVisible, setWindowVisible] = useState(false);
  const [offerings, setOfferings] = useState<PurchasesPackage[]>([]);

  useEffect(() => {
    Purchases.getOfferings().then(result => {
      setOfferings(result.current?.availablePackages || []);
    });
  });

  const showWindow = () => {
    setWindowVisible(true);
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
          <BasicText textVariant="heading" style={{textAlign: 'center'}}>
            Try Premium!
          </BasicText>
          <View style={{margin: 10, marginLeft: 25}}>
            <BasicText>Some feature</BasicText>
            <BasicText>Some feature</BasicText>
            <BasicText>Some feature</BasicText>
            <BasicText>Some feature</BasicText>
            <BasicText>Some feature</BasicText>
            <BasicText>Some feature</BasicText>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
            }}>
            {offerings.map((item, index) => (
              <BasicButton
                key={index}
                onPress={() => {
                  Purchases.purchasePackage(item);
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
        </BasicModalCard>
        {children}
      </>
    </PremiumWindowContext.Provider>
  );
};
