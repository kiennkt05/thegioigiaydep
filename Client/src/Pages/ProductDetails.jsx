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
import { FaTruck, FaUndo, FaStar, FaShareAlt, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
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
    const [reviews, setReviews] = useState([]);
    const [reviewStats, setReviewStats] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
    const toast = useToast();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:3000/api/products/${id}`);
                const data = await response.json();
                setProduct(data);
                if (data.variants && data.variants.length > 0) {
                    const inStockVariant = data.variants.find(v => v.stock > 0) || data.variants[0];
                    setSelectedSize(inStockVariant.size);
                    setSelectedVariant(inStockVariant);
                }

                const revRes = await fetch(`http://localhost:3000/api/reviews/${id}`);
                const revData = await revRes.json();
                setReviews(revData);

                const stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
                revData.forEach(r => stats[r.rating]++);
                setReviewStats(stats);

            } catch (error) {
                console.error("Error fetching product details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

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

    const FitVisualizer = ({ fit }) => {
        const fitMap = { 'Runs Small': 20, 'True to Size': 50, 'Runs Large': 80 };
        const position = fitMap[fit] || 50;
        return (
            <Box mt={6} p={4} bg="gray.50" borderRadius="xl">
                <Text fontSize="sm" fontWeight="bold" mb={3}>Fit Survey: {fit}</Text>
                <Box h="4px" bg="gray.200" borderRadius="full" position="relative">
                    <Box
                        position="absolute"
                        left={`${position}%`}
                        top="-6px"
                        w="16px"
                        h="16px"
                        bg="#0076BD"
                        borderRadius="full"
                        transform="translateX(-50%)"
                        boxShadow="0 0 10px rgba(0, 118, 189, 0.4)"
                    />
                </Box>
                <Flex justify="space-between" mt={2} fontSize="10px" color="gray.500" textTransform="uppercase" fontWeight="bold">
                    <Text>Runs Small</Text>
                    <Text>True to Size</Text>
                    <Text>Runs Large</Text>
                </Flex>
            </Box>
        );
    };

    if (loading) return <Center h="100vh"><Spinner size="xl" /></Center>;
    if (!product) return <Center h="100vh"><Text>Product not found</Text></Center>;

    return (
        <Box>
            <Box maxW="1200px" mx="auto" p={6}>
                <Breadcrumb mb={10} fontSize="xs" color="gray.400" textTransform="uppercase" letterSpacing="widest">
                    <BreadcrumbItem><BreadcrumbLink as={RouterLink} to="/">Home</BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage color="gray.800" fontWeight="600"><BreadcrumbLink>{product.title}</BreadcrumbLink></BreadcrumbItem>
                </Breadcrumb>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={16}>
                    <MotionBox initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <Box borderRadius="2xl" overflow="hidden" boxShadow="2xl">
                            <Image src={product.images[0]} alt={product.title} w="100%" h="auto" objectFit="cover" />
                        </Box>
                    </MotionBox>

                    <MotionStack spacing={8} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <Box>
                            <Flex align="center" justify="space-between">
                                <Text fontSize="xs" fontWeight="700" color="#0076BD">{product.brand}</Text>
                                <HStack spacing={1} cursor="pointer" onClick={() => document.getElementById('reviews-section').scrollIntoView({ behavior: 'smooth' })}>
                                    <Icon as={FaStar} color="orange.400" />
                                    <Text fontWeight="bold" fontSize="sm">{product.rating}</Text>
                                    <Text color="gray.400" fontSize="sm">({product.reviewCount} Reviews)</Text>
                                </HStack>
                            </Flex>
                            <Heading as="h1" size="xl" mt={2} color="#003977">{product.title}</Heading>
                            <Flex align="center" mt={4} gap={6}>
                                <Text fontSize="3xl" fontWeight="800">${selectedVariant?.price}</Text>
                                <Badge colorScheme="green" variant="subtle">Free Shipping & Returns</Badge>
                            </Flex>
                        </Box>
                        <FitVisualizer fit={product.fit_recommendation} />
                        <Divider />
                        <Box>
                            <Text fontWeight="700" mb={4}>Select Size</Text>
                            <SimpleGrid columns={4} spacing={3}>
                                {product.variants.map((v) => (
                                    <Button
                                        key={v.sku}
                                        variant={selectedSize === v.size ? "solid" : "outline"}
                                        colorScheme={selectedSize === v.size ? "blue" : "gray"}
                                        isDisabled={v.stock === 0}
                                        onClick={() => { setSelectedSize(v.size); setSelectedVariant(v); }}
                                        borderRadius="xl" h="50px"
                                    >
                                        {v.size}
                                    </Button>
                                ))}
                            </SimpleGrid>
                        </Box>
                        <Button
                            bg="#003977" color="white" size="lg" h="65px" borderRadius="2xl"
                            onClick={handleAddToCart} isDisabled={selectedVariant?.stock === 0}
                            leftIcon={<Icon as={TbShoppingBagPlus} />}
                        >
                            {selectedVariant?.stock === 0 ? "Out of Stock" : "Add to Bag"}
                        </Button>
                    </MotionStack>
                </SimpleGrid>

                <Box mt={24} id="reviews-section">
                    <Heading size="lg" mb={10} color="#003977">Customer Reviews</Heading>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={12}>
                        <Box>
                            <Flex align="center" gap={4}>
                                <Text fontSize="5xl" fontWeight="800">{product.rating}</Text>
                                <Box>
                                    <HStack spacing={1}>
                                        {[1, 2, 3, 4, 5].map(i => <Icon key={i} as={FaStar} color={i <= Math.round(product.rating) ? "orange.400" : "gray.200"} />)}
                                    </HStack>
                                    <Text fontSize="xs" color="gray.500">{product.reviewCount} Reviews</Text>
                                </Box>
                            </Flex>
                            <Stack spacing={2} mt={4}>
                                {[5, 4, 3, 2, 1].map(stars => (
                                    <Flex key={stars} align="center" gap={3}>
                                        <Text fontSize="xs" fontWeight="bold" w="20px">{stars}</Text>
                                        <Box flex="1" h="8px" bg="gray.100" borderRadius="full">
                                            <Box w={`${product.reviewCount > 0 ? (reviewStats[stars] / product.reviewCount) * 100 : 0}%`} h="100%" bg="orange.400" borderRadius="full" />
                                        </Box>
                                        <Text fontSize="xs" color="gray.400" w="30px">{reviewStats[stars]}</Text>
                                    </Flex>
                                ))}
                            </Stack>
                        </Box>
                        <Box gridColumn={{ md: "span 2" }}>
                            {reviews.length === 0 ? <Text color="gray.500">No reviews yet.</Text> : (
                                <Stack spacing={8}>
                                    {reviews.map(review => (
                                        <Box key={review._id} borderBottom="1px solid" borderColor="gray.100" pb={8}>
                                            <HStack mb={2}>
                                                {[1, 2, 3, 4, 5].map(i => <Icon key={i} as={FaStar} color={i <= review.rating ? "orange.400" : "gray.200"} boxSize={3} />)}
                                                <Text fontSize="xs" fontWeight="800" ml={2}>{review.title}</Text>
                                            </HStack>
                                            <Text fontSize="sm">{review.comment}</Text>
                                            <Flex align="center" mt={4} gap={4}>
                                                <Text fontSize="xs" fontWeight="bold">By {review.userName}</Text>
                                                <Text fontSize="xs" color="gray.400">{new Date(review.createdAt).toLocaleDateString()}</Text>
                                            </Flex>
                                        </Box>
                                    ))}
                                </Stack>
                            )}
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
