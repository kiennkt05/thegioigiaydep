import {
    Box,
    Container,
    Stack,
    Text,
    Heading,
    Flex,
    Avatar,
    Divider,
    Icon,
    Button,
    useColorModeValue,
    SimpleGrid,
} from "@chakra-ui/react";
import { useAuth } from "../Context/AuthContext";
import { FaUser, FaEnvelope, FaPhone, FaHistory } from "react-icons/fa";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Footer from "./Footer";

function Profile() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.100", "gray.700");

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    if (!user) return null;

    return (
        <Box bg="gray.50" minH="100vh">
            <Container maxW="container.md" py={12}>
                <Stack spacing={8}>
                    {/* Hero Profile Section */}
                    <Box
                        bg={bgColor}
                        p={8}
                        borderRadius="3xl"
                        boxShadow="xl"
                        border="1px solid"
                        borderColor={borderColor}
                        overflow="hidden"
                        position="relative"
                    >
                        <Box
                            position="absolute"
                            top={0}
                            left={0}
                            right={0}
                            h="100px"
                            bgGradient="linear(to-r, blue.400, blue.600)"
                        />
                        <Stack spacing={6} align="center" position="relative" pt={4}>
                            <Avatar
                                size="2xl"
                                name={user.name}
                                border="4px solid white"
                                boxShadow="lg"
                            />
                            <Stack spacing={1} align="center">
                                <Heading size="lg" color="#003977">{user.name}</Heading>
                                <Text color="gray.500" fontWeight="medium">Valued Customer</Text>
                            </Stack>
                        </Stack>
                    </Box>

                    {/* Account Details */}
                    <Box
                        bg={bgColor}
                        p={8}
                        borderRadius="3xl"
                        boxShadow="lg"
                        border="1px solid"
                        borderColor={borderColor}
                    >
                        <Heading size="md" mb={6} color="#003977">Account Information</Heading>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                            <Flex align="center" gap={4}>
                                <Flex
                                    w="40px"
                                    h="40px"
                                    bg="blue.50"
                                    color="blue.500"
                                    borderRadius="full"
                                    align="center"
                                    justify="center"
                                >
                                    <Icon as={FaUser} />
                                </Flex>
                                <Box>
                                    <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase">Full Name</Text>
                                    <Text fontWeight="600">{user.name}</Text>
                                </Box>
                            </Flex>

                            <Flex align="center" gap={4}>
                                <Flex
                                    w="40px"
                                    h="40px"
                                    bg="green.50"
                                    color="green.500"
                                    borderRadius="full"
                                    align="center"
                                    justify="center"
                                >
                                    <Icon as={FaEnvelope} />
                                </Flex>
                                <Box>
                                    <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase">Email Address</Text>
                                    <Text fontWeight="600">{user.email}</Text>
                                </Box>
                            </Flex>

                            <Flex align="center" gap={4}>
                                <Flex
                                    w="40px"
                                    h="40px"
                                    bg="purple.50"
                                    color="purple.500"
                                    borderRadius="full"
                                    align="center"
                                    justify="center"
                                >
                                    <Icon as={FaPhone} />
                                </Flex>
                                <Box>
                                    <Text fontSize="xs" fontWeight="bold" color="gray.400" textTransform="uppercase">Phone Number</Text>
                                    <Text fontWeight="600">{user.phoneNumber || "Not provided"}</Text>
                                </Box>
                            </Flex>
                        </SimpleGrid>
                    </Box>

                    {/* Quick Actions */}
                    <Box
                        bg={bgColor}
                        p={8}
                        borderRadius="3xl"
                        boxShadow="lg"
                        border="1px solid"
                        borderColor={borderColor}
                    >
                        <Heading size="md" mb={6} color="#003977">Quick Actions</Heading>
                        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                            <Button
                                as={RouterLink}
                                to="/orders"
                                leftIcon={<FaHistory />}
                                colorScheme="blue"
                                variant="outline"
                                h="60px"
                                borderRadius="xl"
                            >
                                Order History
                            </Button>
                            <Button
                                onClick={logout}
                                colorScheme="red"
                                variant="ghost"
                                h="60px"
                                borderRadius="xl"
                            >
                                Sign Out
                            </Button>
                        </SimpleGrid>
                    </Box>
                </Stack>
            </Container>
            <Footer />
        </Box>
    );
}

export default Profile;
