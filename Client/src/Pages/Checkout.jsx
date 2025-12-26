import { useState } from "react";
import {
    Box,
    Stack,
    Heading,
    Text,
    Flex,
    Input,
    Button,
    SimpleGrid,
    FormControl,
    FormLabel,
    Divider,
    useToast,
    Center,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";

function Checkout() {
    const { cart, cartTotal, userId, fetchCart } = useCart();
    const navigate = useNavigate();
    const toast = useToast();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "USA",
    });

    const [paymentData, setPaymentData] = useState({
        cardHolder: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        setPaymentData({ ...paymentData, [name]: value });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handlePlaceOrder = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    items: cart.items,
                    totalAmount: cartTotal,
                    shippingAddress: formData,
                }),
            });

            if (response.ok) {
                toast({
                    title: "Order Placed!",
                    status: "success",
                    duration: 3000,
                });
                await fetchCart();
                navigate("/order-success");
            } else {
                throw new Error("Order failed");
            }
        } catch (error) {
            console.error("Error placing order:", error);
            toast({
                title: "Error",
                description: "Failed to place order.",
                status: "error",
            });
        }
    };

    return (
        <Box maxW="800px" mx="auto" p={8}>
            <Flex mb={10} justify="space-between" position="relative">
                {[1, 2, 3].map(i => (
                    <Flex key={i} direction="column" align="center" zIndex={1} bg="white" px={2}>
                        <Center
                            w="40px" h="40px"
                            bg={step >= i ? "#003977" : "gray.200"}
                            color="white"
                            borderRadius="full"
                            fontWeight="bold"
                        >
                            {i}
                        </Center>
                        <Text fontSize="xs" mt={2} fontWeight={step === i ? "bold" : "normal"}>
                            {i === 1 ? "Shipping" : i === 2 ? "Payment" : "Review"}
                        </Text>
                    </Flex>
                ))}
                <Box position="absolute" top="20px" left="0" right="0" h="2px" bg="gray.100" zIndex={0} />
            </Flex>

            <Box bg="white" p={8} borderRadius="2xl" boxShadow="xl" border="1px solid" borderColor="gray.100">
                {step === 1 && (
                    <Stack spacing={6}>
                        <Heading size="md" mb={4}>Shipping Address</Heading>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Full Name</FormLabel>
                                <Input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="John Doe" />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Address</FormLabel>
                                <Input name="address" value={formData.address} onChange={handleInputChange} placeholder="123 Main St" />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>City</FormLabel>
                                <Input name="city" value={formData.city} onChange={handleInputChange} placeholder="New York" />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Zip Code</FormLabel>
                                <Input name="zipCode" value={formData.zipCode} onChange={handleInputChange} placeholder="10001" />
                            </FormControl>
                        </SimpleGrid>
                        <Button colorScheme="blue" size="lg" h="60px" w="full" onClick={nextStep} isDisabled={!formData.fullName || !formData.address}>Continue to Payment</Button>
                    </Stack>
                )}

                {step === 2 && (
                    <Stack spacing={6}>
                        <Heading size="md" mb={4}>Payment Information</Heading>
                        <Stack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Cardholder Name</FormLabel>
                                <Input name="cardHolder" value={paymentData.cardHolder} onChange={handlePaymentChange} placeholder="John Doe" />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Card Number</FormLabel>
                                <Input name="cardNumber" value={paymentData.cardNumber} onChange={handlePaymentChange} placeholder="0000 0000 0000 0000" />
                            </FormControl>
                            <Flex gap={4}>
                                <FormControl isRequired>
                                    <FormLabel>Expiry Date</FormLabel>
                                    <Input name="expiryDate" value={paymentData.expiryDate} onChange={handlePaymentChange} placeholder="MM/YY" />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>CVV</FormLabel>
                                    <Input name="cvv" type="password" value={paymentData.cvv} onChange={handlePaymentChange} placeholder="123" />
                                </FormControl>
                            </Flex>
                        </Stack>
                        <Flex gap={4}>
                            <Button variant="outline" size="lg" h="60px" flex={1} onClick={prevStep}>Back</Button>
                            <Button colorScheme="blue" size="lg" h="60px" flex={2} onClick={nextStep} isDisabled={!paymentData.cardNumber}>Review Order</Button>
                        </Flex>
                    </Stack>
                )}

                {step === 3 && (
                    <Stack spacing={8}>
                        <Heading size="md">Order Review</Heading>
                        <Stack spacing={4} bg="gray.50" p={6} borderRadius="xl">
                            <Flex justify="space-between" fontWeight="bold">
                                <Text>Total Amount:</Text>
                                <Text fontSize="xl">${cartTotal}</Text>
                            </Flex>
                            <Divider />
                            <Box fontSize="sm">
                                <Text fontWeight="bold">Ship to:</Text>
                                <Text>{formData.fullName}</Text>
                                <Text>{formData.address}, {formData.city} {formData.zipCode}</Text>
                            </Box>
                            <Divider />
                            <Box fontSize="sm">
                                <Text fontWeight="bold">Payment:</Text>
                                <Text>Card ending in {paymentData.cardNumber.slice(-4) || "****"}</Text>
                            </Box>
                        </Stack>
                        <Flex gap={4}>
                            <Button variant="outline" size="lg" h="60px" flex={1} onClick={prevStep}>Back</Button>
                            <Button bg="#003977" color="white" _hover={{ bg: "#002a57" }} size="lg" h="60px" flex={2} onClick={handlePlaceOrder}>Place Order</Button>
                        </Flex>
                    </Stack>
                )}
            </Box>
        </Box>
    );
}

export default Checkout;
