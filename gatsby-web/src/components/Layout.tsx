import { Box, Flex } from "@chakra-ui/react";
import React, { createRef, useEffect } from "react";
import { LayoutGroup, motion } from "framer-motion";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";

interface LayoutProps {
  children?: React.ReactNode;
  pathname: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,

  pathname,
}) => {
  return (
    <Flex flexDirection={"column"} minHeight="100vh">
      <LayoutGroup>
        <NavBar pathname={pathname} />
        <Box flex={1} as={motion.div} layout="position" mt={8} pb={32}>
          {children}
        </Box>
        <Footer />
      </LayoutGroup>
    </Flex>
  );
};
