import { Box, Heading, Text, Button, Stack, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionStack = motion(Stack);

function Hero() {
    return (
        <Box
            position="relative"
            h={{ base: "400px", md: "600px" }}
            borderRadius="3xl"
            overflow="hidden"
            mx={5}
            mt={5}
            backgroundImage="url('https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"
            backgroundSize="cover"
            backgroundPosition="center"
        >
            <Box
                position="absolute"
                inset={0}
                bgGradient="linear(to-r, blackAlpha.700, transparent)"
            />
            <Flex
                position="relative"
                h="100%"
                align="center"
                px={{ base: 8, md: 24 }}
            >
                <MotionStack
                    spacing={6}
                    maxW="600px"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <Badge alignSelf="flex-start" colorScheme="orange" px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="bold">
                        NEW SEASON ARRIVALS
                    </Badge>
                    <Heading color="white" size="3xl" lineHeight="1.1">
                        Step Into Your <br />
                        <Text as="span" color="#0076BD">New Evolution</Text>
                    </Heading>
                    <Text color="gray.200" fontSize="lg" fontWeight="500">
                        Explore our latest collaboration and signature styles designed for comfort and performance.
                    </Text>
                    <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
                        <Button
                            h="60px"
                            px={10}
                            bg="#0076BD"
                            color="white"
                            _hover={{ bg: "#005a91", transform: "scale(1.05)" }}
                            borderRadius="2xl"
                            fontSize="md"
                            fontWeight="bold"
                            transition="all 0.3s"
                        >
                            Shop Men's
                        </Button>
                        <Button
                            h="60px"
                            px={10}
                            variant="outline"
                            color="white"
                            borderColor="whiteAlpha.500"
                            _hover={{ bg: "whiteAlpha.200", transform: "scale(1.05)" }}
                            borderRadius="2xl"
                            fontSize="md"
                            fontWeight="bold"
                            transition="all 0.3s"
                        >
                            Shop Women's
                        </Button>
                    </Stack>
                </MotionStack>
            </Flex>
        </Box>
    );
}

import { Badge } from "@chakra-ui/react";
export default Hero;
