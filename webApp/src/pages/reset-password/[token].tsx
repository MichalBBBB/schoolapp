import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { InputField } from "../../components/InputField";
import { Layout } from "../../components/Layout";
import { UserError, useResetPasswordMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";

const ResetPassword: NextPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const [errors, setErrors] = useState<UserError[]>([]);
  const [resetPassword] = useResetPasswordMutation();
  return (
    <Layout width={500}>
      <Heading style={{ fontWeight: "bold" }}>Reset your password</Heading>
      <Formik
        initialValues={{
          newPassword: "",
          passwordControl: "",
        }}
        onSubmit={async (values, { setErrors }) => {
          if (values.newPassword == values.passwordControl) {
            const reponse = await resetPassword({
              variables: {
                token: token as string,
                newPassword: values.newPassword,
              },
            });
            if (reponse.errors) {
              setErrors(toErrorMap(errors));
            } else {
              router.push("/reset-password/success");
            }
          } else {
            setErrors({ passwordControl: "Passwords do not match" });
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form style={{ flexDirection: "column", display: "flex" }}>
            <Box mt={4}>
              <InputField
                label="New password"
                name="newPassword"
                placeholder="New Password"
                type="password"
              />
            </Box>
            <Box mt={4}>
              <InputField
                label="Repeat password"
                name="passwordControl"
                placeholder="Repeat Password"
                type="password"
              />
            </Box>
            <Box display={"flex"} justifyContent="center" width={"100%"} mt={4}>
              <Button type="submit" isLoading={isSubmitting}>
                Submit
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default ResetPassword;
