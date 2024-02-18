import { Flex, Grid, GridItem, Text, Image } from "@chakra-ui/react";
import React from "react";
import { WidthContainer } from "../../WidthContainer";
import SubtasksImage from "../../../images/Subtasks.png";
import EventsImage from "../../../images/Event.png";
import GroupProjectImage from "../../../images/Group_project.png";
import ClassesImage from "../../../images/Classes.png";

const sections: { title: string; description: string; image: string }[] = [
  {
    title: "Add Subtasks",
    description: "Each task can have up to a 100 subtasks",
    image: SubtasksImage,
  },
  {
    title: "Create Events",
    description: "Write down all your tests, quizzes and other one-time events",
    image: EventsImage,
  },
  {
    title: "Add all your classes",
    description: "Add your timetable to use the app more effectively",
    image: ClassesImage,
  },
  {
    title: "Create group projects",
    description: "Invite your classmates to work on collaborative projects",
    image: GroupProjectImage,
  },
];

export const DarkFeaturesSection = () => {
  return (
    <Flex backgroundColor={"#161616"}>
      <WidthContainer wide={true}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Text color="white" paddingY="12" fontSize={40} fontWeight={"bold"}>
            Features
          </Text>
        </Flex>
        <Grid
          templateColumns={{
            base: "1fr",
            md: `repeat(2, 1fr)`,
          }}
        >
          {sections.map((item, index) => (
            <GridItem>
              <Flex
                flexDirection={"column"}
                flex={1}
                alignItems={"center"}
                padding={10}
              >
                <Image
                  borderTopRadius={20}
                  src={item.image}
                  width={250}
                  fit={"contain"}
                  objectPosition={"0 0"}
                  marginBottom={5}
                />
                <Text
                  fontSize={20}
                  fontWeight={"bold"}
                  color="white"
                  textAlign={"center"}
                >
                  {item.title}
                </Text>
                <Text
                  fontSize={14}
                  fontWeight={"medium"}
                  color="whiteAlpha.700"
                  textAlign={"center"}
                >
                  {item.description}
                </Text>
              </Flex>
            </GridItem>
          ))}
        </Grid>
      </WidthContainer>
    </Flex>
  );
};
