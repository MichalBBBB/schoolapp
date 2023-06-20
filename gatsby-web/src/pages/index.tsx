import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import { Layout } from "../components/Layout";
import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";
import TasksImage from "../images/Tasks.png";
import CalendarImage from "../images/Calendar.png";

const IndexPage: React.FC<PageProps> = ({ location }) => {
  return (
    <Layout pathname={location.pathname}>
      <Flex alignItems={"center"}>
        <Box flex={2} marginRight={20}>
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
        </Box>

        <Box flex={1} position="relative">
          <Image
            src={TasksImage}
            height={500}
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
            height={500}
            fit="contain"
            borderRadius={20}
            shadow="xl"
            overflow="hidden"
            zIndex={-1}
          />
        </Box>
      </Flex>
    </Layout>
  );
};

export default IndexPage;
