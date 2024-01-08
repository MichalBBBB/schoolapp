import { PageProps } from "gatsby";
import React from "react";
import { Layout } from "../components/Layout";
import { Box, Heading, Text } from "@chakra-ui/react";
import { WidthContainer } from "../components/WidthContainer";

const Terms: React.FC<PageProps> = ({ location }) => {
  return (
    <Layout pathname={location.pathname}>
      <WidthContainer>
        <Box paddingX={10} paddingTop={10}>
          <Heading paddingY={5}>These are the terms of service</Heading>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ut
            ipsum tincidunt, congue nisi a, pretium tortor. Fusce at auctor
            mauris. Vivamus vel ligula et massa blandit fringilla. Duis lacus
            metus, vestibulum quis tempus sed, venenatis ut felis. Nunc
            eleifend, lectus eget ullamcorper luctus, eros neque tempus dui, et
            mollis est magna eu mauris. Cras vestibulum lectus non commodo
            tincidunt. Vivamus ex ante, fermentum ac egestas quis, ultrices
            ornare est.
          </Text>
          <Heading paddingY={5}>Heading</Heading>
          <Text>
            Aliquam iaculis rhoncus urna, sed consectetur libero malesuada quis.
            Sed mattis eu tellus sit amet scelerisque. Aliquam laoreet erat ut
            fermentum blandit. Sed non risus feugiat, aliquet metus vitae,
            ullamcorper eros. Donec pulvinar suscipit scelerisque. Vestibulum
            aliquet dui ac tellus placerat laoreet. Pellentesque ornare
            convallis sem quis consectetur. Nunc fermentum consectetur lorem,
            aliquam tempus quam varius at. Quisque aliquam vestibulum tortor non
            scelerisque. Etiam consectetur eu quam nec pulvinar. Morbi et congue
            erat, vel ullamcorper ex. Vivamus nec turpis in erat luctus
            tincidunt nec ut massa. Quisque commodo leo vel tellus gravida, nec
            efficitur sapien laoreet. Curabitur ut congue ex, vel venenatis
            turpis. Ut ac tellus eget lorem interdum fermentum eleifend non
            eros. Aenean eu gravida sapien, dictum volutpat diam.
          </Text>
          <Heading paddingY={5}>Heading</Heading>
          <Text>
            Cras mollis nibh nulla. Aenean a felis sed nulla bibendum tempor.
            Pellentesque habitant morbi tristique senectus et netus et malesuada
            fames ac turpis egestas. Mauris nec accumsan lacus. Vivamus interdum
            lobortis nisl. Suspendisse euismod vitae mi eu porttitor. Nam
            condimentum sollicitudin nisl. Integer nisi ligula, volutpat
            accumsan aliquam quis, sodales vel ex. Praesent posuere volutpat mi,
            in consequat felis vehicula id. Proin vitae bibendum ante, sit amet
            iaculis dolor. Duis vitae nunc finibus, luctus purus id, blandit
            mauris. Donec ut turpis at enim consectetur venenatis id eu enim. In
            a interdum mi.
          </Text>
          <Heading paddingY={5}>Heading</Heading>
          <Text>
            Sed nunc dolor, egestas vel bibendum eget, mollis nec est. Curabitur
            fermentum lectus sed nunc blandit mattis. Mauris fringilla, nisl sed
            condimentum finibus, purus magna euismod purus, rhoncus dapibus
            tellus nisi nec lectus. In efficitur consequat nulla, nec viverra
            ipsum auctor a. Integer vehicula urna id faucibus dignissim. Ut
            ultrices dolor sed semper egestas. Cras in sodales neque.
          </Text>
          <Heading paddingY={5}>Heading</Heading>
          <Text>
            Donec facilisis, elit eu eleifend tempor, libero nunc posuere
            sapien, sit amet aliquam libero ligula nec ligula. Donec vehicula
            tincidunt accumsan. Maecenas placerat sapien a dolor pretium mollis.
            Ut blandit rhoncus sodales. Mauris sed tincidunt felis. Phasellus
            pellentesque, magna ac mollis feugiat, nisi ligula malesuada sem,
            sit amet dictum nisl tellus eu lectus. Ut sit amet nisi et ipsum
            dignissim aliquam sit amet lacinia ex. Morbi commodo, quam congue
            iaculis molestie, massa dolor bibendum dui, at accumsan ex tellus a
            est. Maecenas fermentum mauris elit, et ultricies lacus commodo in.
            Mauris rutrum nulla in neque suscipit, viverra consectetur felis
            pharetra
          </Text>
        </Box>
      </WidthContainer>
    </Layout>
  );
};

export default Terms;
