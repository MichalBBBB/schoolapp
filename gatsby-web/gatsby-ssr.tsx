import React from "react";
import { ChakraProvider } from "@chakra-ui/react";

export const wrapPageElement = ({ element, props }) => {
  return <ChakraProvider>{element}</ChakraProvider>;
};
