import {EntryAnimationsValues, withTiming} from 'react-native-reanimated';
export const MenuEnteringAnimation = (targetValues: EntryAnimationsValues) => {
  'worklet';
  console.log('here', targetValues);
  const animations = {
    originX: withTiming(targetValues.targetOriginX, {duration: 500}),
    transform: [{scale: withTiming(1, {duration: 500})}],
  };
  const initialValues = {
    originX: targetValues.targetOriginX + targetValues.targetWidth,
    transform: [{scale: 0}],
  };
  return {
    initialValues,
    animations,
  };
};
