import { Box, SimpleGrid, Image, Text, Heading, Center, Stack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const categories = [
    { title: "Womens", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", link: "/womans" },
    { title: "Mens", image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", link: "/mens" },
    { title: "Kids", image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", link: "/kids" },
];

function CategorySection() {
    return (
        <Box px={5} py={20}>
            <Center mb={12}>
                <Stack align="center" spacing={2}>
                    <Heading size="xl" color="#003977">Shop by Category</Heading>
                    <Box h="4px" w="60px" bg="#0076BD" borderRadius="full" />
                </Stack>
            </Center>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
                {categories.map((cat) => (
                    <MotionBox
                        key={cat.title}
                        as={Link}
                        to={cat.link}
                        position="relative"
                        h="450px"
                        borderRadius="3xl"
                        overflow="hidden"
                        whileHover={{ y: -10 }}
                        transition={{ duration: 0.3 }}
                        boxShadow="xl"
                    >
                        <Image
                            src={cat.image}
                            alt={cat.title}
                            w="100%"
                            h="100%"
                            objectFit="cover"
                            transition="transform 0.5s ease"
                            _hover={{ transform: "scale(1.1)" }}
                        />
                        <Box
                            position="absolute"
                            inset={0}
                            bgGradient="linear(to-t, blackAlpha.800, transparent)"
                        />
                        <Center position="absolute" bottom={10} left={0} right={0}>
                            <Heading color="white" size="lg">{cat.title}</Heading>
                        </Center>
                    </MotionBox>
                ))}
            </SimpleGrid>
        </Box>
    );
}

export default CategorySection;
