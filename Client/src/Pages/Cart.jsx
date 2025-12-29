import React from "react";
import {
    Box,
    Flex,
    Heading,
    Stack,
    Image,
    Text,
    IconButton,
    Button,
    Divider,
    useColorModeValue,
    Switch,
    FormControl,
    FormLabel,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    Portal,
    SimpleGrid as ChakraSimpleGrid,
} from "@chakra-ui/react";
import { FaTrash, FaMinus, FaPlus, FaEdit } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import Footer from "./Footer";

function Cart() {
    const { cart, removeFromCart, updateQuantity, cartTotal, toggleItemTryAtHome, addAdditionalSize } = useCart();
    const bgColor = useColorModeValue("white", "gray.800");

    if (!cart || cart.items.length === 0) {
        return (
            <Box>
                <Flex direction="column" align="center" justify="center" minH="60vh" p={8}>
                    <Heading size="lg" mb={4}>Your bag is empty</Heading>
                    <Text color="gray.500" mb={8}>Looks like you haven't added anything to your bag yet.</Text>
                    <Button as={RouterLink} to="/" colorScheme="teal" size="lg">
                        Start Shopping
                    </Button>
                </Flex>
                <Footer />
            </Box>
        );
    }

    // Group items by productId for trial size logic
    const groupedItems = cart.items.reduce((acc, item) => {
        if (!acc[item.productId]) acc[item.productId] = [];
        acc[item.productId].push(item);
        return acc;
    }, {});

    return (
        <Box>
            <Box maxW="1200px" mx="auto" p={{ base: 4, md: 8 }}>
                <Heading as="h1" size="xl" mb={8}>
                    My Bag ({Object.keys(groupedItems).length} {Object.keys(groupedItems).length === 1 ? 'Item' : 'Items'})
                </Heading>

                <Stack direction={{ base: "column", lg: "row" }} spacing={8} align="start">
                    {/* Cart Items List */}
                    <Stack spacing={6} w="full" flex="2">
                        {Object.values(groupedItems).map((group) => {
                            // Find the primary item (the one that is NOT a trial item)
                            const primaryItem = group.find(i => !i.sku?.startsWith("TRY-")) || group[0];
                            // Find the trial item (the one that IS a trial item for this product)
                            const trialItem = group.find(i => i.sku?.startsWith("TRY-"));

                            return (
                                <Box key={primaryItem.productId} p={6} bg="white" borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
                                    <Stack direction={{ base: "column", md: "row" }} spacing={6} align="center">
                                        <Image
                                            src={primaryItem.image}
                                            alt={primaryItem.title}
                                            boxSize="120px"
                                            objectFit="contain"
                                            borderRadius="xl"
                                        />
                                        <Box flex="1">
                                            <Heading size="sm" mb={1}>
                                                <RouterLink to={`/product/${primaryItem.productId}`}>
                                                    {primaryItem.title}
                                                </RouterLink>
                                            </Heading>
                                            <Stack spacing={1}>
                                                <Text fontSize="sm" color="gray.600">
                                                    Size: <Text as="span" fontWeight="bold">{primaryItem.size}</Text>
                                                </Text>
                                                <Text fontSize="sm" color="gray.600">
                                                    Price: <Text as="span" fontWeight="bold">${primaryItem.price}</Text>
                                                </Text>

                                                {/* Per-item Try-at-home Toggle */}
                                                <Box mt={2}>
                                                    <FormControl display="flex" alignItems="center" gap={2}>
                                                        <Switch
                                                            size="sm"
                                                            colorScheme="blue"
                                                            isChecked={primaryItem.tryAtHome}
                                                            onChange={() => toggleItemTryAtHome(primaryItem.productId, primaryItem.size)}
                                                        />
                                                        <FormLabel mb="0" fontSize="xs" fontWeight="bold">Try-at-home</FormLabel>
                                                    </FormControl>

                                                    {primaryItem.tryAtHome && (
                                                        <Box mt={2}>
                                                            {trialItem && (
                                                                <Text fontSize="11px" mb={2}>
                                                                    Selected trial size: <b>{trialItem.size}</b>
                                                                </Text>
                                                            )}
                                                            <Popover placement="bottom-start" isLazy>
                                                                {({ onClose }) => (
                                                                    <>
                                                                        <PopoverTrigger>
                                                                            <Button
                                                                                size="xs"
                                                                                variant="outline"
                                                                                colorScheme="blue"
                                                                                w="180px"
                                                                                leftIcon={trialItem ? <FaEdit size={10} /> : <FaPlus size={10} />}
                                                                            >
                                                                                {trialItem ? "Change trial size" : "Add another size"}
                                                                            </Button>
                                                                        </PopoverTrigger>
                                                                        <Portal>
                                                                            <PopoverContent border="1px solid" borderColor="blue.100" boxShadow="xl" _focus={{ boxShadow: "xl" }}>
                                                                                <PopoverArrow bg="blue.50" />
                                                                                <PopoverHeader border="0" bg="blue.50" fontSize="xs" fontWeight="bold" color="blue.700">
                                                                                    Select Comparison Size
                                                                                </PopoverHeader>
                                                                                <PopoverBody p={3}>
                                                                                    <ChakraSimpleGrid columns={4} spacing={2}>
                                                                                        {["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "12"]
                                                                                            .map(s => {
                                                                                                const isCurrent = s === primaryItem.size;
                                                                                                const isSelectedTrial = trialItem && trialItem.size === s;
                                                                                                return (
                                                                                                    <Button
                                                                                                        key={s}
                                                                                                        size="sm"
                                                                                                        variant={isSelectedTrial ? "solid" : "outline"}
                                                                                                        colorScheme={isSelectedTrial ? "blue" : "gray"}
                                                                                                        isDisabled={isCurrent}
                                                                                                        fontSize="xs"
                                                                                                        onClick={() => {
                                                                                                            if (!isSelectedTrial) {
                                                                                                                addAdditionalSize(primaryItem, primaryItem.size, s);
                                                                                                                onClose();
                                                                                                            }
                                                                                                        }}
                                                                                                        _hover={!isSelectedTrial && !isCurrent ? { bg: "blue.50", borderColor: "blue.200" } : {}}
                                                                                                    >
                                                                                                        {s}
                                                                                                    </Button>
                                                                                                );
                                                                                            })}
                                                                                    </ChakraSimpleGrid>
                                                                                </PopoverBody>
                                                                            </PopoverContent>
                                                                        </Portal>
                                                                    </>
                                                                )}
                                                            </Popover>
                                                            <Text fontSize="10px" color="blue.500" mt={1}>2 sizes, keep 1</Text>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Stack>
                                        </Box>

                                        {/* Quantity & Actions */}
                                        <Flex align="center" gap={6} mt={{ base: 4, md: 0 }} w={{ base: "full", md: "auto" }}>
                                            <Flex align="center" border="1px solid" borderColor="gray.200" borderRadius="md">
                                                <IconButton
                                                    icon={<FaMinus />}
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => updateQuantity(primaryItem.productId, primaryItem.size, primaryItem.quantity - 1)}
                                                    isDisabled={primaryItem.quantity <= 1}
                                                    aria-label="Decrease quantity"
                                                />
                                                <Text px={3} fontWeight="bold">{primaryItem.quantity}</Text>
                                                <IconButton
                                                    icon={<FaPlus />}
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => updateQuantity(primaryItem.productId, primaryItem.size, primaryItem.quantity + 1)}
                                                    aria-label="Increase quantity"
                                                />
                                            </Flex>
                                            <Box textAlign="right">
                                                <Text fontWeight="bold" fontSize="lg" minW="80px">
                                                    ${((primaryItem.price * primaryItem.quantity) + (trialItem ? trialItem.price * trialItem.quantity : 0)).toFixed(2)}
                                                </Text>
                                                {trialItem && (
                                                    <Text fontSize="10px" color="gray.500">
                                                        (Incl. trial size)
                                                    </Text>
                                                )}
                                            </Box>
                                            <IconButton
                                                icon={<FaTrash />}
                                                colorScheme="red"
                                                variant="ghost"
                                                onClick={() => removeFromCart(primaryItem.productId, primaryItem.size)}
                                                aria-label="Remove item"
                                            />
                                        </Flex>
                                    </Stack>
                                </Box>
                            );
                        })}
                    </Stack>

                    {/* Order Summary */}
                    <Box flex="1" bg={bgColor} p={6} borderRadius="2xl" borderWidth="1px" boxShadow="sm" w="full" position={{ lg: "sticky" }} top={{ lg: "100px" }}>
                        <Heading size="md" mb={6}>Order Summary</Heading>
                        <Stack spacing={4}>
                            <Flex justify="space-between">
                                <Text color="gray.600">Subtotal</Text>
                                <Text fontWeight="bold">${cartTotal.toFixed(2)}</Text>
                            </Flex>
                            <Flex justify="space-between">
                                <Text color="gray.600">Shipping</Text>
                                <Box textAlign="right">
                                    <Text color="green.500" fontWeight="bold">FREE</Text>
                                    <Text fontSize="10px" color="gray.400">(ABSORBED BY THEGIOIGIAYDEP)</Text>
                                </Box>
                            </Flex>
                            <Divider />
                            <Flex justify="space-between" fontSize="lg" fontWeight="bold">
                                <Text>Total</Text>
                                <Text color="teal.600">${cartTotal.toFixed(2)}</Text>
                            </Flex>
                            <Button
                                as={RouterLink}
                                to="/checkout"
                                colorScheme="teal"
                                size="lg"
                                w="full"
                                py={7}
                                mt={4}
                                borderRadius="xl"
                                _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                                transition="all 0.2s"
                            >
                                Checkout Now
                            </Button>
                        </Stack>
                    </Box>
                </Stack>
            </Box>
            <Footer />
        </Box>
    );
}

export default Cart;
