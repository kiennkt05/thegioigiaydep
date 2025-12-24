import {
    Box,
    Center,
    Heading,
    Stack,
    Text,
    Spinner,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    Image,
    HStack,
    VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";

function OrderHistory() {
    const { user, token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/orders/${user.id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Center h="50vh">
                <Spinner size="xl" />
            </Center>
        );
    }

    if (!user) {
        return (
            <Center h="50vh">
                <Text>Please log in to view your order history.</Text>
            </Center>
        );
    }

    return (
        <Box maxW="1200px" mx="auto" p={{ base: 4, md: 8 }}>
            <Heading mb={8}>Your Order History</Heading>
            {orders.length === 0 ? (
                <Text color="gray.500">You haven't placed any orders yet.</Text>
            ) : (
                <Stack spacing={8}>
                    {orders.map((order) => (
                        <Box key={order._id} p={6} border="1px" borderColor="gray.200" borderRadius="lg" bg="white" shadow="sm">
                            <VStack align="start" spacing={4} width="full">
                                <HStack justify="space-between" width="full">
                                    <VStack align="start" spacing={0}>
                                        <Text fontWeight="bold">Order No: {order._id}</Text>
                                        <Text fontSize="sm" color="gray.500">Placed on: {new Date(order.createdAt).toLocaleDateString()}</Text>
                                    </VStack>
                                    <Badge colorScheme={order.status === 'delivered' ? 'green' : 'blue'}>
                                        {order.status.toUpperCase()}
                                    </Badge>
                                </HStack>

                                <Box width="full">
                                    <Table variant="simple" size="sm">
                                        <Thead>
                                            <Tr>
                                                <Th>Item</Th>
                                                <Th isNumeric>Qty</Th>
                                                <Th isNumeric>Price</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {order.items.map((item, idx) => (
                                                <Tr key={idx}>
                                                    <Td>
                                                        <HStack>
                                                            <Image src={item.image} boxSize="40px" objectFit="cover" borderRadius="md" alt={item.title} />
                                                            <Box>
                                                                <Text fontWeight="medium" fontSize="sm">{item.title}</Text>
                                                                <Text fontSize="xs" color="gray.500">Size: {item.size}</Text>
                                                            </Box>
                                                        </HStack>
                                                    </Td>
                                                    <Td isNumeric>{item.quantity}</Td>
                                                    <Td isNumeric>${item.price.toFixed(2)}</Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                </Box>

                                <HStack justify="space-between" width="full" pt={4}>
                                    <Box>
                                        <Text fontWeight="bold" fontSize="sm">Shipping Address:</Text>
                                        <Text fontSize="xs" color="gray.600">
                                            {order.shippingAddress.fullName}<br />
                                            {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                        </Text>
                                    </Box>
                                    <VStack align="end" spacing={0}>
                                        <Text fontSize="sm">Total Amount:</Text>
                                        <Text fontWeight="bold" fontSize="lg" color="teal.600">
                                            ${order.totalAmount.toFixed(2)}
                                        </Text>
                                    </VStack>
                                </HStack>
                            </VStack>
                        </Box>
                    ))}
                </Stack>
            )}
        </Box>
    );
}

export default OrderHistory;
