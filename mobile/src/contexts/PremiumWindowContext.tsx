import {useReactiveVar} from '@apollo/client';
import React, {useEffect} from 'react';
import {createContext, useContext, useState} from 'react';
import {ImageSourcePropType, View} from 'react-native';
import Purchases, {PurchasesPackage} from 'react-native-purchases';
import {isLoadingVar} from '../App';
import {BasicButton} from '../components/basicViews/BasicButton';
import {BasicModalCard} from '../components/basicViews/BasicModalCard';
import {BasicText} from '../components/basicViews/BasicText';
import {packagesVar} from '../Content';
import {refreshToken} from '../utils/AccessToken';
import {BasicIcon} from '../components/basicViews/BasicIcon';

const PremiumWindowContext = createContext<() => void>(() => {});

export const usePremiumWindow = () => {
  const value = useContext(PremiumWindowContext);
  return value;
};

interface PremiumItemProps {
  text: string;
  subtext: string;
  iconSrc: ImageSourcePropType;
}

export const PremiumItem: React.FC<PremiumItemProps> = ({
  text,
  subtext,
  iconSrc,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
      }}>
      <BasicIcon
        source={iconSrc}
        style={{height: 30, width: 30, marginRight: 0}}
        color="text"
      />
      <View style={{flex: 1, backgroundColor: undefined, marginLeft: 10}}>
        <BasicText style={{fontSize: 18, fontWeight: 'bold'}}>{text}</BasicText>
        <BasicText color="textSecondary">{subtext}</BasicText>
      </View>
    </View>
  );
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
          <View style={{margin: 10, marginLeft: 10}}>
            <PremiumItem
              text="More Tasks"
              subtext="Add unlimited number of tasks"
              iconSrc={require('../../assets/Tasks.png')}
            />
            <PremiumItem
              text="Group Projects"
              subtext="Create group projects and invite your friends"
              iconSrc={require('../../assets/Projects.png')}
            />
            <PremiumItem
              text="Advanced timetable options"
              subtext="Change rotation length or whether to skip weekends"
              iconSrc={require('../../assets/Settings.png')}
            />
            <PremiumItem
              text="Add more schedules"
              subtext="Add more schedules for more complex timetables"
              iconSrc={require('../../assets/Calendar.png')}
            />
          </View>
          <View
            style={{
              flexDirection: 'row-reverse',
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
                backgroundColor={
                  item.product.subscriptionPeriod == 'P1Y'
                    ? 'accentBackground'
                    : undefined
                }
                borderColor={
                  item.product.subscriptionPeriod == 'P1Y'
                    ? 'accent'
                    : undefined
                }
                variant={
                  item.product.subscriptionPeriod == 'P1Y'
                    ? 'outlined'
                    : 'outlined'
                }>
                <BasicText
                  style={{textAlign: 'center'}}
                  textVariant="subHeading"
                  color={
                    item.product.subscriptionPeriod == 'P1Y' ? 'accent' : 'text'
                  }>
                  {item.product.title}
                </BasicText>
                <BasicText
                  style={{textAlign: 'center'}}
                  color={
                    item.product.subscriptionPeriod == 'P1Y' ? 'accent' : 'text'
                  }>
                  2 weeks free
                </BasicText>
                <BasicText
                  style={{textAlign: 'center'}}
                  textVariant={'heading'}
                  color={
                    item.product.subscriptionPeriod == 'P1Y' ? 'accent' : 'text'
                  }>
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
