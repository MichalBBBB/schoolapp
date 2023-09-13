import { Flex, Link, Text } from "@chakra-ui/react";
import React from "react";
import { Link as GatsbyLink } from "gatsby";
import { WidthContainer } from "./WidthContainer";

export const Footer = () => {
  return (
    <Flex paddingY={20} bgColor="#f0f0f0">
      <WidthContainer>
        <Flex
          flexDirection={{ base: "column", md: "row" }}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Link as={GatsbyLink} color="black" to="/privacy">
            <Text mr={5}>Privacy Policy</Text>
          </Link>
          <Link as={GatsbyLink} color="black" to="/terms">
            <Text>Terms of Service</Text>
          </Link>
        </Flex>
      </WidthContainer>
    </Flex>
  );
};
