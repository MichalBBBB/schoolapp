import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import { Layout } from "../components/Layout";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import TasksImage from "../images/Tasks.png";
import CalendarImage from "../images/Calendar.png";
import { WidthContainer } from "../components/WidthContainer";
import { DarkFeaturesSection } from "../components/sections/index/DarkFeatures";
import { TitleSection } from "../components/sections/index/Title";

const IndexPage: React.FC<PageProps> = ({ location }) => {
  return (
    <Layout pathname={location.pathname}>
      <TitleSection />
      <DarkFeaturesSection />
    </Layout>
  );
};

export default IndexPage;
