import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { useVerifyEmailMutation } from "../../generated/graphql";

const VerifyEmail: NextPage = () => {
  const router = useRouter();
  const token = router.query.token;
  const [isVerified, setIsVerified] = useState(false);
  const [verifyEmail] = useVerifyEmailMutation();
  useEffect(() => {
    (async () => {
      if (token) {
        await verifyEmail({ variables: { token: token as string } });
        setIsVerified(true);
      }
    })();
  }, [token]);
  if (!isVerified) {
    return <h1>Loading...</h1>;
  }
  return (
    <Layout>
      <Box alignItems={"center"} marginTop={200} width="100%">
        <Heading textAlign="center">Your email has been verified</Heading>
      </Box>
      <Text fontSize={100} textAlign="center">
        👍
      </Text>
    </Layout>
  );
};

export default VerifyEmail;
