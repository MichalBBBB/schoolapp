import React from "react";
import { Box } from "@chakra-ui/react";

interface WidthContainerProps {
  wide?: boolean;
  children?: React.ReactNode;
}

export const WidthContainer: React.FC<WidthContainerProps> = ({
  wide,
  children,
}) => {
  return (
    <Box w="90%" maxW={wide ? 2000 : 1000} mx="auto">
      {children}
    </Box>
  );
};
