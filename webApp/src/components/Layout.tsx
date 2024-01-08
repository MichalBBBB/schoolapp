import { Box } from "@chakra-ui/react";
import React, { createRef, useEffect } from "react";

interface LayoutProps {
  children?: React.ReactNode;
  width?: number;
}

export const Layout: React.FC<LayoutProps> = ({ children, width = 1000 }) => {
  return (
    <Box flexDirection={"column"} minHeight="100vh">
      <Box flex={1} mt={8} pb={200} mx="auto" width="90%" maxWidth={width}>
        {children}
      </Box>
    </Box>
  );
};
