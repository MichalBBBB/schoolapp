import { PageProps } from "gatsby";
import React from "react";
import { Layout } from "../components/Layout";
import { Heading, Text } from "@chakra-ui/react";

const Pricing: React.FC<PageProps> = ({ location }) => {
  return (
    <Layout pathname={location.pathname}>
      <Heading>This is the pricing </Heading>
    </Layout>
  );
};

export default Pricing;
