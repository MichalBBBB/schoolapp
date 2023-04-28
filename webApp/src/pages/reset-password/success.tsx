import { Flex, Heading } from "@chakra-ui/react";
import { NextPage } from "next";
import { Layout } from "../../components/Layout";

const Success: NextPage = () => {
  return (
    <Layout>
      <Flex width={"100%"} justifyContent="center" pt={100}>
        <Heading>Your password has been reset</Heading>
      </Flex>
    </Layout>
  );
};

export default Success;
