import { Box, Flex } from "@chakra-ui/react";
import React, { createRef, useEffect } from "react";
import { LayoutGroup, motion } from "framer-motion";
import { NavBar } from "./NavBar";

interface LayoutProps {
  children?: React.ReactNode;
  wide?: boolean;
  pathname: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  wide = false,
  pathname,
}) => {
  return (
    <Flex flexDirection={"column"} minHeight="100vh">
      <LayoutGroup>
        <NavBar pathname={pathname} />
        <Box
          flex={1}
          as={motion.div}
          layout="position"
          mt={8}
          pb={200}
          mx="auto"
          w="90%"
          maxW={wide ? 2000 : 1000}
        >
          {children}
        </Box>
      </LayoutGroup>
    </Flex>
  );
};
