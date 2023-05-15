import React, {useState} from 'react';
import {ScrollView} from 'react-native';
import {isLoadingVar} from '../../../App';
import {BasicButton} from '../../../components/basicViews/BasicButton';
import {BasicText} from '../../../components/basicViews/BasicText';
import {BasicTextInput} from '../../../components/basicViews/BasicTextInput';
import {useChangePasswordMutation, UserError} from '../../../generated/graphql';
import {SettingsStackScreenProps} from '../../../utils/types';

export const ChangePasswordScreen: React.FC<
  SettingsStackScreenProps<'ChangePasswordScreen'>
> = ({navigation}) => {
  const [changePasswordMutation] = useChangePasswordMutation({
    context: {
      skipQueue: true,
    },
  });
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordControl, setPasswordControl] = useState('');
  const [errors, setErrors] = useState<Array<UserError>>([]);

  const changePassword = async () => {
    isLoadingVar(true);
    const result = await changePasswordMutation({
      variables: {newPassword: password, oldPassword},
    });
    isLoadingVar(false);
    console.log(result);
    if (result.data?.changePassword.__typename == 'UserFail') {
      setErrors(result.data.changePassword.errors);
    } else {
      navigation.goBack();
    }
  };

  const checkPasswordControl = () => {
    if (password !== passwordControl) {
      setErrors([
        ...errors,
        {
          field: 'passwordControl',
          message: 'Passwords do not match',
        },
      ]);
      return false;
    } else {
      return true;
    }
  };

  return (
    <ScrollView style={{padding: 20}}>
      <BasicTextInput
        autoCapitalize="none"
        placeholder="Old password"
        secureTextEntry={true}
        spacing="m"
        marginBottom={10}
        onChangeText={value => {
          setErrors(errors.filter(item => item.field !== 'password') || []);
          setOldPassword(value);
        }}
        error={errors.find(item => item.field == 'password')?.message}
      />
      <BasicTextInput
        placeholder="New password"
        autoCapitalize="none"
        secureTextEntry={true}
        spacing="m"
        marginBottom={10}
        onChangeText={value => {
          setErrors(errors.filter(item => item.field !== 'newPassword') || []);
          setPassword(value);
        }}
        error={errors.find(item => item.field == 'newPassword')?.message}
      />
      <BasicTextInput
        autoCapitalize="none"
        placeholder="Repeat password"
        secureTextEntry={true}
        spacing="m"
        marginBottom={10}
        onChangeText={value => {
          setErrors(
            errors.filter(item => item.field !== 'passwordControl') || [],
          );
          setPasswordControl(value);
        }}
        error={errors.find(item => item.field == 'passwordControl')?.message}
        onEndEditing={() => {
          checkPasswordControl();
        }}
      />
      <BasicButton
        spacing="m"
        onPress={() => {
          const passwordsMatch = checkPasswordControl();
          if (passwordsMatch) {
            changePassword();
          }
        }}>
        <BasicText textVariant="button" color="textContrast">
          Submit
        </BasicText>
      </BasicButton>
    </ScrollView>
  );
};
