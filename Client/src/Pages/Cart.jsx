import {
    Box,
    Heading,
    Text,
    Stack,
    Image,
    Button,
    Flex,
    Divider,
    IconButton,
    Input,
    useColorModeValue,
    SimpleGrid,
} from "@chakra-ui/react";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import { useCart } from "../Context/CartContext";

function Cart() {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const bgColor = useColorModeValue("white", "gray.800");

    if (!cart?.items || cart.items.length === 0) {
        return (
            <Flex direction="column" align="center" justify="center" minH="50vh" textAlign="center" p={6}>
                <Heading size="lg" mb={4}>Your Bag is Empty</Heading>
                <Text color="gray.500" mb={8}>
                    Looks like you haven't added any items to the bag yet.
                </Text>
                <Button as={RouterLink} to="/mens" colorScheme="teal" size="lg">
                    Start Shopping
                </Button>
            </Flex>
        );
    }

    return (
        <Box maxW="1200px" mx="auto" p={{ base: 4, md: 8 }}>
            <Heading as="h1" size="xl" mb={8}>
                My Bag ({cart.items.length} Items)
            </Heading>

            <Stack direction={{ base: "column", lg: "row" }} spacing={8} align="start">
                {/* Cart Items List */}
                <Stack spacing={4} w="full" flex="2">
                    {cart.items.map((item) => (
                        <Flex
                            key={`${item.productId}-${item.size}`}
                            direction={{ base: "column", sm: "row" }}
                            bg={bgColor}
                            p={4}
                            boxShadow="sm"
                            borderRadius="lg"
                            borderWidth="1px"
                            align="center"
                            justify="space-between"
                        >
                            <Flex align="center" gap={4} w="full">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    boxSize="100px"
                                    objectFit="contain"
                                    borderRadius="md"
                                />
                                <Box flex="1">
                                    <Heading size="sm" mb={1}>
                                        <RouterLink to={`/product/${item.productId}`}>
                                            {item.title}
                                        </RouterLink>
                                    </Heading>
                                    <Text fontSize="sm" color="gray.600">
                                        Size: <Text as="span" fontWeight="bold">{item.size}</Text>
                                    </Text>
                                    <Text fontSize="sm" color="gray.600">
                                        Price: <Text as="span" fontWeight="bold">${item.price}</Text>
                                    </Text>
                                </Box>
                            </Flex>

                            {/* Quantity & Actions */}
                            <Flex align="center" gap={6} mt={{ base: 4, sm: 0 }} w={{ base: "full", sm: "auto" }}>
                                <Flex align="center" border="1px solid" borderColor="gray.200" borderRadius="md">
                                    <IconButton
                                        icon={<FaMinus />}
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                                        isDisabled={item.quantity <= 1}
                                        aria-label="Decrease quantity"
                                    />
                                    <Text px={3} fontWeight="bold">{item.quantity}</Text>
                                    <IconButton
                                        icon={<FaPlus />}
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                                        aria-label="Increase quantity"
                                    />
                                </Flex>
                                <Text fontWeight="bold" fontSize="lg" minW="80px" textAlign="right">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </Text>
                                <IconButton
                                    icon={<FaTrash />}
                                    colorScheme="red"
                                    variant="ghost"
                                    onClick={() => removeFromCart(item.productId, item.size)}
                                    aria-label="Remove item"
                                />
                            </Flex>
                        </Flex>
                    ))}
                </Stack>

                {/* Order Summary */}
                <Box
                    flex="1"
                    bg={bgColor}
                    p={6}
                    borderRadius="lg"
                    borderWidth="1px"
                    boxShadow="sm"
                    w="full"
                    position={{ lg: "sticky" }}
                    top={{ lg: "100px" }}
                >
                    <Heading size="md" mb={6}>Order Summary</Heading>
                    <Stack spacing={4}>
                        <Flex justify="space-between">
                            <Text color="gray.600">Subtotal</Text>
                            <Text fontWeight="bold">${cartTotal.toFixed(2)}</Text>
                        </Flex>
                        <Flex justify="space-between">
                            <Text color="gray.600">Shipping</Text>
                            <Text color="green.500" fontWeight="bold">Free</Text>
                        </Flex>
                        <Flex justify="space-between">
                            <Text color="gray.600">Estimated Tax</Text>
                            <Text>$0.00</Text>
                        </Flex>
                        <Divider />
                        <Flex justify="space-between" fontSize="xl" fontWeight="bold">
                            <Text>Total</Text>
                            <Text>${cartTotal.toFixed(2)}</Text>
                        </Flex>
                    </Stack>
                    <Button
                        as={RouterLink}
                        to="/checkout"
                        colorScheme="teal"
                        size="lg"
                        w="full"
                        mt={8}
                        fontSize="lg"
                    >
                        Proceed to Checkout
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
}

export default Cart;
