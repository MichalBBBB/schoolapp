import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { createRef, useEffect, useLayoutEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Link as GatsbyLink, PageProps } from "gatsby";
import React from "react";

export const NavBar: React.FC<{ pathname: string }> = ({ pathname }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const bigMenu = useBreakpointValue({
    base: false,
    md: true,
  });

  useEffect(() => {
    console.log(pathname);
  });

  const variants: Variants = {
    visible: {
      height: "auto",
      display: "flex",
      transition: { type: "tween", duration: bigMenu ? 0 : undefined },
      marginTop: bigMenu ? 0 : 10,
      transitionEnd: { display: "flex" },
    },
    hidden: {
      height: 0,
      transitionEnd: { display: "none" },
      transition: { staggerChildren: 0.01, type: "tween" },
      marginTop: 0,
    },
  };

  const menuList = (
    <Flex
      overflow="hidden"
      ml={4}
      flex={1}
      alignItems={{ base: "flex-start", md: "center" }}
      justifyContent={{ base: undefined, md: "center" }}
      flexDirection={{ base: "column", md: "row" }}
      gap={4}
      // display={{ base: isMenuOpen ? "flex" : "none", md: "flex" }}
    >
      <Box as={motion.div}>
        <Link
          as={GatsbyLink}
          color="black"
          to="/"
          fontWeight={pathname == "/" ? "bold" : "normal"}
        >
          <Text>Overview</Text>
        </Link>
      </Box>
      <Box as={motion.div}>
        <Link
          as={GatsbyLink}
          color="black"
          to="/pricing"
          fontWeight={pathname == "/pricing/" ? "bold" : "normal"}
        >
          <Text>Pricing</Text>
        </Link>
      </Box>
    </Flex>
  );

  const navBarLeft = (
    <Flex
      alignItems="center"
      as={motion.div}
      layout={false}
      bg="white"
      zIndex={2}
    >
      <IconButton
        aria-label="menu"
        icon={<HamburgerIcon />}
        color="black"
        variant="unstyled"
        display={{ base: "block", md: "none" }}
        onClick={() => {
          setIsMenuOpen(!isMenuOpen);
        }}
      />
      <Link as={GatsbyLink} mr={4}>
        <Flex alignItems={"center"}>
          {/* <img
            src={"/logo.svg"}
            height={50}
            width={50}
            color="white"
            style={{ fill: "white", marginRight: 10 }}
          /> */}
          <Heading color="black" whiteSpace={"nowrap"}>
            Dayto
          </Heading>
        </Flex>
      </Link>
    </Flex>
  );

  return (
    // Whole top part
    <Flex
      zIndex={2}
      position="sticky"
      top={0}
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      {/* NavBar container*/}
      <Flex
        as={motion.div}
        layout={!bigMenu}
        bg="white"
        justifyContent="center"
        flex={1}
        p={3}
        w="100%"
        overflow="hidden"
      >
        {/* Main navbar content */}
        <Flex
          flex={1}
          alignItems={{ base: "flex-start", md: "center" }}
          flexDirection={{ base: "column", md: "row" }}
          maxW={1000}
          paddingX={{ base: 0, md: 10 }}
        >
          {navBarLeft}
          {/* Animated menulist */}
          <Box
            flex={{ base: undefined, md: 1 }}
            as={motion.div}
            variants={variants}
            justifyContent={{ base: undefined, md: "center" }}
            initial={bigMenu ? "visible" : "hidden"}
            animate={bigMenu ? "visible" : isMenuOpen ? "visible" : "hidden"}
          >
            {menuList}
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};
