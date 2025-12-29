import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    Stack,
    Box,
    Flex,
    Image,
    Text,
    Heading,
    Switch,
    FormControl,
    FormLabel,
    Divider,
    IconButton,
    HStack,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    Portal,
    SimpleGrid as ChakraSimpleGrid,
    Collapse,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus, FaTrash, FaEdit, FaShoppingBag } from "react-icons/fa";
import { useCart } from "../Context/CartContext";

function QuickBuyDrawer({ isOpen, onClose, selectedItem }) {
    const navigate = useNavigate();
    const { addToCart, addAdditionalSize } = useCart();
    const [tempItems, setTempItems] = useState([]);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [showTrialPicker, setShowTrialPicker] = useState(false);

    // Initialize tempItems when drawer opens with a new selectedItem
    useEffect(() => {
        if (isOpen && selectedItem) {
            // Only initialize if we're not already showing this product to prevent resets on re-renders
            const isDifferentProduct = !tempItems[0] ||
                tempItems[0].productId !== (selectedItem._id || selectedItem.productId);

            if (isDifferentProduct || tempItems.length === 0) {
                setTempItems([{
                    productId: selectedItem._id || selectedItem.productId,
                    title: selectedItem.title,
                    price: selectedItem.variants?.find(v => v.size === selectedItem.size)?.price || selectedItem.price,
                    image: (selectedItem.images && selectedItem.images[0]) || selectedItem.image || selectedItem.img,
                    size: selectedItem.size,
                    sku: selectedItem.variants?.find(v => v.size === selectedItem.size)?.sku || "SKU",
                    quantity: 1,
                    tryAtHome: false
                }]);
            }
        }
    }, [isOpen, selectedItem?._id, selectedItem?.productId, selectedItem?.size]);

    const toggleTryAtHome = (productId, size) => {
        setTempItems(prev => {
            const turningOff = prev.find(i => i.productId === productId && i.size === size)?.tryAtHome;
            let updated = prev.map(item =>
                (item.productId === productId && item.size === size)
                    ? { ...item, tryAtHome: !item.tryAtHome }
                    : item
            );

            if (turningOff) {
                // If it was ON and we are toggling to OFF, remove additional sizes
                updated = updated.filter(i => !(i.productId === productId && i.size !== size));
            }
            return updated;
        });
    };

    const addAdditionalSizeHandler = (product, currentSize, newSize) => {
        setTempItems(prev => {
            const base = prev[0];
            const newItem = {
                ...base,
                size: newSize,
                sku: `TRY-${base.sku}-${newSize}`,
                tryAtHome: true,
                quantity: 1
            };

            if (prev.length > 1) {
                // Replace the additional size (keep primary at index 0)
                return [prev[0], newItem];
            } else {
                // Add as second size
                return [...prev, newItem];
            }
        });
    };

    const removeSize = (size) => {
        setTempItems(prev => prev.filter(i => i.size !== size));
    };

    if (tempItems.length === 0) return null;

    const total = tempItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader borderBottomWidth="1px" bg="#f8f9fa">
                    <Heading size="md" color="#003977">Quick Buy Confirmation</Heading>
                    <Text fontSize="xs" color="gray.500" fontWeight="normal">Review your selection before checkout</Text>
                </DrawerHeader>

                <DrawerBody bg="gray.50">
                    <Stack spacing={4} mt={4}>
                        <Box bg="white" p={4} borderRadius="2xl" boxShadow="sm">
                            <Stack spacing={6}>
                                {tempItems.slice(0, 1).map((item, index) => {
                                    const primaryItem = tempItems[0];
                                    const trialItem = tempItems.length > 1 ? tempItems[1] : null;

                                    return (
                                        <Box key={`${item.productId}-${item.size}`}>
                                            <Flex gap={4}>
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    boxSize="100px"
                                                    objectFit="contain"
                                                    borderRadius="lg"
                                                    border="1px solid"
                                                    borderColor="gray.100"
                                                />
                                                <Box flex="1">
                                                    <Heading size="sm" mb={1}>{item.title}</Heading>
                                                    <Text fontSize="sm" color="gray.600">Size: <Text as="span" fontWeight="bold">{item.size}</Text></Text>
                                                    <Flex justify="space-between" align="center" mt={4}>
                                                        <HStack bg="gray.100" borderRadius="lg" p={1} spacing={4}>
                                                            <IconButton size="xs" icon={<FaMinus size={10} />} aria-label="Decrease" variant="ghost" onClick={() => {
                                                                if (item.quantity > 1) {
                                                                    setTempItems(prev => prev.map(i => i.size === item.size ? { ...i, quantity: i.quantity - 1 } : i));
                                                                }
                                                            }} />
                                                            <Text fontSize="sm" fontWeight="bold">{item.quantity}</Text>
                                                            <IconButton size="xs" icon={<FaPlus size={10} />} aria-label="Increase" variant="ghost" onClick={() => {
                                                                setTempItems(prev => prev.map(i => i.size === item.size ? { ...i, quantity: i.quantity + 1 } : i));
                                                            }} />
                                                        </HStack>
                                                        <Text fontSize="lg" fontWeight="bold">${(item.price * item.quantity).toFixed(2)}</Text>
                                                    </Flex>

                                                    <Box mt={4} p={3} bg="blue.50" borderRadius="xl">
                                                        <FormControl display="flex" alignItems="center" justifyContent="space-between">
                                                            <Box>
                                                                <FormLabel mb="0" fontWeight="bold" fontSize="xs">
                                                                    Try-at-home
                                                                </FormLabel>
                                                                <Text fontSize="9px" color="blue.600">Order 2 sizes, keep 1.</Text>
                                                            </Box>
                                                            <Switch
                                                                size="sm"
                                                                isChecked={item.tryAtHome}
                                                                onChange={() => toggleTryAtHome(item.productId, item.size)}
                                                                colorScheme="blue"
                                                            />
                                                        </FormControl>

                                                        {item.tryAtHome && (
                                                            <Box mt={2}>
                                                                {trialItem && (
                                                                    <Text fontSize="11px" mb={2}>
                                                                        Selected trial size: <b>{trialItem.size}</b>
                                                                    </Text>
                                                                )}

                                                                <Button
                                                                    size="xs"
                                                                    variant="outline"
                                                                    colorScheme="blue"
                                                                    w="180px"
                                                                    onClick={() => setShowTrialPicker(!showTrialPicker)}
                                                                    leftIcon={trialItem ? <FaEdit size={10} /> : <FaPlus size={10} />}
                                                                    mb={2}
                                                                >
                                                                    {trialItem ? "Change trial size" : "Add another size"}
                                                                </Button>

                                                                <Collapse in={showTrialPicker} animateOpacity>
                                                                    <Box border="1px solid" borderColor="blue.100" borderRadius="md" p={3} bg="blue.50">
                                                                        <Text fontSize="xs" fontWeight="bold" color="blue.700" mb={2}>
                                                                            Select Comparison Size
                                                                        </Text>
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
                                                                                                    addAdditionalSizeHandler(primaryItem, primaryItem.size, s);
                                                                                                    setShowTrialPicker(false);
                                                                                                }
                                                                                            }}
                                                                                            _hover={!isSelectedTrial && !isCurrent ? { bg: "blue.50", borderColor: "blue.200" } : {}}
                                                                                        >
                                                                                            {s}
                                                                                        </Button>
                                                                                    );
                                                                                })}
                                                                        </ChakraSimpleGrid>
                                                                        <Text fontSize="10px" color="blue.500" mt={2}>2 sizes, keep 1</Text>
                                                                    </Box>
                                                                </Collapse>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Flex>

                                            {/* Breakout Price */}
                                            <Flex justify="flex-end" mt={2}>
                                                <Box textAlign="right">
                                                    <Text fontSize="lg" fontWeight="bold">
                                                        ${((item.price * item.quantity) + (tempItems[1] ? tempItems[1].price * tempItems[1].quantity : 0)).toFixed(2)}
                                                    </Text>
                                                    {tempItems.length > 1 && (
                                                        <Text fontSize="10px" color="gray.500">
                                                            (Incl. trial size)
                                                        </Text>
                                                    )}
                                                </Box>
                                            </Flex>
                                            {index < tempItems.length - 1 && <Divider mt={6} />}
                                        </Box>
                                    );
                                })}
                            </Stack>
                        </Box>

                        <Box bg="white" p={6} borderRadius="2xl" boxShadow="sm">
                            <Heading size="xs" mb={4} color="gray.600">Order Summary</Heading>
                            <Stack spacing={3}>
                                <Flex justify="space-between">
                                    <Text color="gray.600">Subtotal {tempItems.length > 1 ? "(2 sizes)" : ""}</Text>
                                    <Text fontWeight="bold">${total.toFixed(2)}</Text>
                                </Flex>
                                <Flex justify="space-between">
                                    <Text color="gray.600">Shipping</Text>
                                    <Box textAlign="right">
                                        <Text color="green.500" fontWeight="bold">FREE</Text>
                                        <Text fontSize="9px" color="gray.400">(ABSORBED BY THEGIOIGIAYDEP)</Text>
                                    </Box>
                                </Flex>
                                <Divider />
                                <Flex justify="space-between" fontSize="lg" fontWeight="bold">
                                    <Text>Total</Text>
                                    <Text color="#003977">${total.toFixed(2)}</Text>
                                </Flex>
                            </Stack>
                        </Box>
                    </Stack>
                </DrawerBody>

                <DrawerFooter borderTopWidth="1px" gap={3} bg="white" p={4} flexDirection="column">
                    <Flex gap={3} w="full">
                        <Button
                            variant="outline"
                            w="full"
                            h="50px"
                            onClick={async () => {
                                setIsAddingToCart(true);
                                try {
                                    // 1. Add primary variant
                                    const primaryVariant = selectedItem.variants?.find(v => v.size === tempItems[0].size);
                                    await addToCart(selectedItem, primaryVariant, tempItems[0].quantity);

                                    // 2. Add trial size if present
                                    if (tempItems.length > 1) {
                                        await addAdditionalSize(selectedItem, tempItems[0].size, tempItems[1].size);
                                    }

                                    onClose();
                                    navigate("/cart");
                                } catch (error) {
                                    console.error("Failed to add items to bag:", error);
                                } finally {
                                    setIsAddingToCart(false);
                                }
                            }}
                            isLoading={isAddingToCart}
                            leftIcon={<FaShoppingBag />}
                            fontSize="sm"
                        >
                            Add to Bag
                        </Button>
                        <Button
                            colorScheme="teal"
                            w="full"
                            h="50px"
                            onClick={() => {
                                onClose();
                                navigate("/checkout", { state: { directItems: tempItems } });
                            }}
                            fontSize="sm"
                        >
                            Checkout Now
                        </Button>
                    </Flex>
                    <Button variant="ghost" size="sm" w="full" onClick={onClose}>
                        Cancel
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

export default QuickBuyDrawer;
