import { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import {
    Box,
    Image,
    Text,
    Badge,
    Stack,
    Heading,
    Flex,
    Button,
    Select,
    HStack,
    SimpleGrid,
    Spinner,
    Center,
    useToast,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Icon,
    Divider,
} from "@chakra-ui/react";
import { FaTruck, FaUndo, FaShieldAlt, FaStar, FaShareAlt, FaHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { TbShoppingBagPlus } from "react-icons/tb";
import Footer from "./Footer";
import JoinList from "./JoinList";

const MotionBox = motion(Box);
const MotionStack = motion(Stack);

function ProductDetails() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedVariant, setSelectedVariant] = useState(null);
    const toast = useToast();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:3000/api/products/${id}`);
                const data = await response.json();
                setProduct(data);
                if (data.variants && data.variants.length > 0) {
                    // Find first variant that is in stock
                    const inStockVariant = data.variants.find(v => v.stock > 0) || data.variants[0];
                    setSelectedSize(inStockVariant.size);
                    setSelectedVariant(inStockVariant);
                }
            } catch (error) {
                console.error("Error fetching product details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleSizeChange = (e) => {
        const size = e.target.value;
        setSelectedSize(size);
        const variant = product.variants.find((v) => v.size === size);
        setSelectedVariant(variant);
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            toast({
                title: "Please select a size",
                status: "warning",
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        addToCart(product, selectedVariant, 1);
    };

    if (loading) {
        return (
            <Center h="100vh">
                <Spinner size="xl" color="#003977" thickness="4px" />
            </Center>
        );
    }

    if (!product) {
        return (
            <Center h="100vh">
                <Stack align="center" spacing={4}>
                    <Text fontSize="2xl" fontWeight="bold">
                        Product not found
                    </Text>
                    <Button as={RouterLink} to="/mens" colorScheme="teal">
                        Back to Shop
                    </Button>
                </Stack>
            </Center>
        );
    }

    return (
        <Box>
            <Box maxW="1200px" mx="auto" p={6}>
                {/* Breadcrumbs */}
                <Breadcrumb mb={10} fontSize="xs" color="gray.400" textTransform="uppercase" letterSpacing="widest">
                    <BreadcrumbItem>
                        <BreadcrumbLink as={RouterLink} to="/" _hover={{ color: "#0076BD" }}>Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink as={RouterLink} to={`/${product.gender}s`} _hover={{ color: "#0076BD" }}>
                            {product.gender.charAt(0).toUpperCase() + product.gender.slice(1)}'s {product.category}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage color="gray.800" fontWeight="600">
                        <BreadcrumbLink>{product.title}</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={16}>
                    {/* Left Column: Image Gallery */}
                    <MotionBox
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Box borderRadius="2xl" overflow="hidden" boxShadow="2xl">
                            <Image
                                src={product.images[0]}
                                alt={product.title}
                                fallbackSrc="https://via.placeholder.com/600x600?text=Product+Image"
                                w="100%"
                                h="auto"
                                objectFit="cover"
                                transition="transform 0.5s ease"
                                _hover={{ transform: 'scale(1.05)' }}
                            />
                        </Box>

                        {/* Thumbnails Placeholder (Real data often only has 1 main image in this dataset, but we'll style for future proofing) */}
                        <HStack mt={6} spacing={4}>
                            {product.images.map((img, idx) => (
                                <Box
                                    key={idx}
                                    borderRadius="md"
                                    overflow="hidden"
                                    border="2px solid"
                                    borderColor={idx === 0 ? "#0076BD" : "transparent"}
                                    cursor="pointer"
                                    _hover={{ opacity: 0.8 }}
                                >
                                    <Image src={img} w="80px" h="80px" objectFit="cover" />
                                </Box>
                            ))}
                        </HStack>
                    </MotionBox>

                    {/* Right Column: Product Info */}
                    <MotionStack
                        spacing={8}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Box>
                            <Flex align="center" justify="space-between">
                                <Text fontSize="xs" fontWeight="700" color="#0076BD" textTransform="uppercase" letterSpacing="0.2em">
                                    {product.brand}
                                </Text>
                                <HStack spacing={1}>
                                    <Icon as={FaStar} color="orange.400" />
                                    <Text fontWeight="bold" fontSize="sm">{product.rating || "4.5"}</Text>
                                    <Text color="gray.400" fontSize="sm">({product.reviewCount || "1,240"})</Text>
                                </HStack>
                            </Flex>

                            <Heading as="h1" size="xl" mt={2} color="#003977" letterSpacing="tight">
                                {product.title}
                            </Heading>

                            <Flex align="center" mt={4} gap={6}>
                                <Text fontSize="3xl" fontWeight="800" color="#003977">
                                    ${selectedVariant?.price || product.variants[0]?.price}
                                </Text>
                                <Badge colorScheme="blue" variant="subtle" px={3} py={1} borderRadius="full" fontSize="xs">
                                    365-Day Returns
                                </Badge>
                            </Flex>
                        </Box>

                        <Divider borderColor="gray.100" />

                        {/* Variant Selectors (Tactile Buttons) */}
                        <Box>
                            <Flex justify="space-between" align="center" mb={4}>
                                <Text fontWeight="700" color="gray.700">Select Size</Text>
                                <Text fontSize="xs" color="#0076BD" fontWeight="600" cursor="pointer" _hover={{ textDecor: "underline" }}>
                                    Size Guide
                                </Text>
                            </Flex>
                            <SimpleGrid columns={4} spacing={3}>
                                {product.variants.map((v) => (
                                    <Button
                                        key={v.sku}
                                        variant={selectedSize === v.size ? "solid" : "outline"}
                                        colorScheme={selectedSize === v.size ? "blue" : "gray"}
                                        isDisabled={v.stock === 0}
                                        onClick={() => {
                                            setSelectedSize(v.size);
                                            setSelectedVariant(v);
                                        }}
                                        borderRadius="xl"
                                        h="50px"
                                        fontSize="sm"
                                        _hover={v.stock > 0 ? { transform: 'scale(1.05)' } : {}}
                                        transition="all 0.2s"
                                    >
                                        {v.size}
                                    </Button>
                                ))}
                            </SimpleGrid>
                            {selectedVariant?.stock > 0 && selectedVariant?.stock <= 5 && (
                                <Text mt={3} fontSize="xs" color="red.500" fontWeight="bold">
                                    Only {selectedVariant.stock} left in stock!
                                </Text>
                            )}
                        </Box>

                        <Stack spacing={4}>
                            <Button
                                bg="#003977"
                                color="white"
                                _hover={{ bg: "#002a57", transform: 'scale(1.02)' }}
                                _active={{ transform: 'scale(0.98)' }}
                                size="lg"
                                h="65px"
                                fontSize="lg"
                                fontWeight="bold"
                                borderRadius="2xl"
                                onClick={handleAddToCart}
                                isDisabled={selectedVariant?.stock === 0}
                                leftIcon={<Icon as={TbShoppingBagPlus} fontSize="2xl" />}
                                transition="all 0.3s"
                                boxShadow="0 8px 15px rgba(0, 57, 119, 0.2)"
                            >
                                {selectedVariant?.stock === 0 ? "Out of Stock" : "Add to Bag"}
                            </Button>

                            <Flex gap={4}>
                                <Button flex="1" variant="outline" borderRadius="xl" leftIcon={<FaHeart />}>Save</Button>
                                <Button flex="1" variant="outline" borderRadius="xl" leftIcon={<FaShareAlt />}>Share</Button>
                            </Flex>
                        </Stack>

                        {/* Trust Badges */}
                        <Stack spacing={4} bg="gray.50" p={5} borderRadius="2xl">
                            <Flex align="center">
                                <Box p={2} bg="white" borderRadius="lg" mr={4} boxShadow="sm">
                                    <Icon as={FaTruck} color="#0076BD" />
                                </Box>
                                <Text fontSize="xs"><b>Free Shipping</b> on all orders, every day.</Text>
                            </Flex>
                            <Flex align="center">
                                <Box p={2} bg="white" borderRadius="lg" mr={4} boxShadow="sm">
                                    <Icon as={FaUndo} color="#0076BD" />
                                </Box>
                                <Text fontSize="xs"><b>365-Day Returns</b>. Shop with confidence.</Text>
                            </Flex>
                        </Stack>
                    </MotionStack>
                </SimpleGrid>

                {/* Product Details Section */}
                <Box mt={20}>
                    <Heading size="md" mb={4}>Product Information</Heading>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                        <Box>
                            <Text fontWeight="bold" mb={1}>Category</Text>
                            <Text color="gray.600">{product.category}</Text>
                            <Text fontWeight="bold" mt={4} mb={1}>Gender</Text>
                            <Text color="gray.600" textTransform="capitalize">{product.gender}</Text>
                        </Box>
                        <Box>
                            <Text fontWeight="bold" mb={1}>Tags</Text>
                            <HStack wrap="wrap">
                                {product.tags.map((tag) => (
                                    <Badge key={tag} colorScheme="gray">{tag}</Badge>
                                ))}
                            </HStack>
                        </Box>
                    </SimpleGrid>
                </Box>
            </Box>

            <JoinList />
            <Footer />
        </Box>
    );
}

export default ProductDetails;
