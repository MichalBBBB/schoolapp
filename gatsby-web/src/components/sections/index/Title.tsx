import {
  Grid,
  GridItem,
  Heading,
  Flex,
  Text,
  Box,
  Image,
} from "@chakra-ui/react";
import React from "react";
import { WidthContainer } from "../../WidthContainer";
import TasksImage from "../../../images/Tasks.png";
import CalendarImage from "../../../images/Calendar.png";

export const TitleSection = () => {
  return (
    <WidthContainer wide={false}>
      <Grid
        alignItems={"center"}
        marginBottom={100}
        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
        rowGap={20}
        columnGap={{ base: 0, md: 20 }}
      >
        <GridItem
          alignItems={"center"}
          colSpan={2}
          textAlign={{ base: "center", md: "left" }}
        >
          <Heading fontSize={60} mb={4} color="gray.700">
            Get rid of the mess with{" "}
            <Text as="span" color="blue.500">
              Dayto
            </Text>
          </Heading>
          <Text fontWeight={"semibold"} color="gray.400" fontSize={25}>
            A smart organizer for all your tasks, assignments, classes and
            tests.
          </Text>
        </GridItem>
        <GridItem flexDirection={"column"} colSpan={1}>
          <Flex
            flexDirection={"column"}
            flex={1}
            alignItems={{ base: "center", md: "left" }}
          >
            <Box
              position={"relative"}
              width={{ base: 345, lg: 390 }}
              // backgroundColor="blue"
            >
              <Image
                src={TasksImage}
                height={{ base: 400, lg: 500 }}
                width={{ base: 185, lg: 231 }}
                fit="contain"
                borderRadius={20}
                shadow="xl"
                overflow="hidden"
              />
              <Image
                position="absolute"
                top={10}
                left={40}
                src={CalendarImage}
                height={{ base: 400, lg: 500 }}
                fit="contain"
                borderRadius={20}
                shadow="xl"
                overflow="hidden"
                zIndex={-1}
              />
            </Box>
          </Flex>
        </GridItem>
      </Grid>
    </WidthContainer>
  );
};
