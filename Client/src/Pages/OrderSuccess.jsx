import {
    Box,
    Button,
    Center,
    Heading,
    Icon,
    Stack,
    Text,
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { Link as RouterLink, useLocation } from "react-router-dom";

function OrderSuccess() {
    const location = useLocation();
    const orderId = location.state?.orderId || "N/A";

    return (
        <Center minH="70vh" p={6}>
            <Stack spacing={6} align="center" textAlign="center" maxW="lg" bg="white" p={10} borderRadius="xl" shadow="md" borderWidth="1px">
                <Icon as={FaCheckCircle} color="green.500" boxSize="80px" />
                <Box>
                    <Heading size="xl" mb={2}>Thank You!</Heading>
                    <Text fontSize="lg" color="gray.600">
                        Your order has been placed successfully.
                    </Text>
                </Box>

                <Box py={4} px={8} bg="blue.50" borderRadius="lg" w="full">
                    <Text fontWeight="bold" color="blue.700">Order ID:</Text>
                    <Text fontSize="md" fontFamily="mono" color="blue.800">{orderId}</Text>
                </Box>

                <Text color="gray.500">
                    We've sent a confirmation email to your inbox with the order details and tracking information.
                </Text>

                <Button
                    as={RouterLink}
                    to="/"
                    colorScheme="teal"
                    size="lg"
                    px={10}
                    fontSize="md"
                >
                    Continue Shopping
                </Button>
            </Stack>
        </Center>
    );
}

export default OrderSuccess;
