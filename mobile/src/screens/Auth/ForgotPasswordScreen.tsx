import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {BasicButton} from '../../components/basicViews/BasicButton';
import {BasicText} from '../../components/basicViews/BasicText';
import {BasicTextInput} from '../../components/basicViews/BasicTextInput';
import {AlertObject, useAlert} from '../../contexts/AlertContext';
import {useForgotPasswordMutation, UserError} from '../../generated/graphql';
import {AuthStackParamList} from '../../routes/AuthStack';

export const ForgotPasswordScreen: React.FC<
  NativeStackScreenProps<AuthStackParamList, 'ForgotPasswordScreen'>
> = ({navigation, route}) => {
  const [email, setEmail] = useState(route.params.email || '');
  const [errors, setErrors] = useState<UserError[]>([]);
  const [forgotPassword] = useForgotPasswordMutation({
    context: {
      skipQueue: true,
    },
  });
  const showAlert = useAlert();
  return (
    <View style={styles.container}>
      <BasicTextInput
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="emailAddress"
        marginBottom={20}
        placeholder="Email"
        spacing="m"
        defaultValue={email}
        onChangeText={value => {
          setEmail(value);
        }}
        error={errors.find(item => item.field == 'email')?.message}
      />
      <BasicButton
        spacing="m"
        onPress={() => {
          (async () => {
            const response = await forgotPassword({variables: {email}});
            if (response.data?.forgotPassword.__typename == 'UserFail') {
              setErrors(response.data.forgotPassword.errors);
            } else {
              showAlert(
                new AlertObject({
                  text: 'Success',
                  subtext: 'We sent you an email to reset your password',
                  submitText: 'Ok',
                  cancelButton: false,
                }).onSubmit(() => {
                  navigation.goBack();
                }),
              );
            }
          })();
        }}>
        <BasicText color="textContrast" textVariant="button">
          Reset Password
        </BasicText>
      </BasicButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 100,
    flex: 1,
    marginHorizontal: 50,
  },
});
