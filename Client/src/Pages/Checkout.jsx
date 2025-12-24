import {
    Box,
    Button,
    Divider,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    Stack,
    Text,
    useToast,
    SimpleGrid,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";

function Checkout() {
    const { cart, cartTotal, userId, fetchCart } = useCart();
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        fullName: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "USA",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!form.fullName || !form.address || !form.city || !form.zipCode) {
            toast({
                title: "Error",
                description: "Please fill in all required shipping details.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("http://localhost:3000/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    items: cart.items,
                    totalAmount: cartTotal,
                    shippingAddress: form,
                }),
            });

            if (response.ok) {
                const orderData = await response.json();
                toast({
                    title: "Order Placed!",
                    description: "Your order has been successfully placed.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });

                // Refresh cart (which should now be empty)
                await fetchCart();

                // Redirect to success page
                navigate("/order-success", { state: { orderId: orderData._id } });
            } else {
                throw new Error("Failed to place order");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            toast({
                title: "Error",
                description: "Failed to place order. Please try again.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    if (!cart?.items || cart.items.length === 0) {
        return (
            <Center h="50vh">
                <Text>Your bag is empty. Please add items before checking out.</Text>
            </Center>
        );
    }

    return (
        <Box maxW="1200px" mx="auto" p={{ base: 4, md: 8 }}>
            <Heading mb={8}>Checkout</Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} align="start">
                {/* Shipping Details */}
                <Box as="form" onSubmit={handlePlaceOrder} bg="white" p={6} borderRadius="lg" shadow="sm" borderWidth="1px">
                    <Heading size="md" mb={6}>Shipping Information</Heading>
                    <Stack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Full Name</FormLabel>
                            <Input name="fullName" value={form.fullName} onChange={handleChange} placeholder="John Doe" />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Street Address</FormLabel>
                            <Input name="address" value={form.address} onChange={handleChange} placeholder="123 Main St" />
                        </FormControl>
                        <SimpleGrid columns={2} spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>City</FormLabel>
                                <Input name="city" value={form.city} onChange={handleChange} placeholder="New York" />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>State</FormLabel>
                                <Input name="state" value={form.state} onChange={handleChange} placeholder="NY" />
                            </FormControl>
                        </SimpleGrid>
                        <SimpleGrid columns={2} spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Zip Code</FormLabel>
                                <Input name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="10001" />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Country</FormLabel>
                                <Input name="country" value={form.country} onChange={handleChange} placeholder="USA" />
                            </FormControl>
                        </SimpleGrid>
                    </Stack>

                    <Heading size="md" mt={10} mb={6}>Payment Information</Heading>
                    <Text color="gray.500" fontSize="sm" mb={4}>
                        This is a demo. Payment is set to "Cash on Delivery" or "Simulated Card".
                    </Text>
                    <FormControl>
                        <FormLabel>Card Details (Optional for Demo)</FormLabel>
                        <Input placeholder="XXXX XXXX XXXX XXXX" isDisabled />
                    </FormControl>

                    <Button
                        mt={10}
                        colorScheme="teal"
                        size="lg"
                        w="full"
                        type="submit"
                        isLoading={loading}
                        loadingText="Placing Order..."
                    >
                        Place Order
                    </Button>
                </Box>

                {/* Order Summary */}
                <Box bg="gray.50" p={6} borderRadius="lg" shadow="sm" borderWidth="1px">
                    <Heading size="md" mb={6}>Order Summary</Heading>
                    <Stack spacing={4}>
                        {cart.items.map((item) => (
                            <Flex key={`${item.productId}-${item.size}`} justify="space-between" align="center">
                                <Box>
                                    <Text fontWeight="bold">{item.title}</Text>
                                    <Text fontSize="xs" color="gray.600">Size: {item.size} | Qty: {item.quantity}</Text>
                                </Box>
                                <Text fontWeight="bold">${(item.price * item.quantity).toFixed(2)}</Text>
                            </Flex>
                        ))}
                        <Divider />
                        <Flex justify="space-between">
                            <Text>Subtotal</Text>
                            <Text>${cartTotal.toFixed(2)}</Text>
                        </Flex>
                        <Flex justify="space-between">
                            <Text>Shipping</Text>
                            <Text color="green.500">Free</Text>
                        </Flex>
                        <Flex justify="space-between" fontWeight="xl" pt={2}>
                            <Text fontWeight="bold" fontSize="lg">Total</Text>
                            <Text fontWeight="bold" fontSize="lg">${cartTotal.toFixed(2)}</Text>
                        </Flex>
                    </Stack>
                </Box>
            </SimpleGrid>
        </Box>
    );
}

export default Checkout;
