import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, Link as RouterLink } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { useAuth } from "../Context/AuthContext";
import AuthModal from "./AuthForm";
import QuickBuyDrawer from "../Components/QuickBuyDrawer";
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
    IconButton,
    useDisclosure,
} from "@chakra-ui/react";
import { FaTruck, FaUndo, FaStar, FaShareAlt, FaHeart, FaPlus, FaMinus, FaShieldAlt, FaTruckMoving, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import { TbShoppingBagPlus } from "react-icons/tb";
import Footer from "./Footer";

const MotionBox = motion(Box);
const MotionStack = motion(Stack);

function ProductDetails() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const { isOpen: isAuthOpen, onOpen: onAuthOpen, onClose: onAuthClose } = useDisclosure();
    const { isOpen: isQuickBuyOpen, onOpen: onQuickBuyOpen, onClose: onQuickBuyClose } = useDisclosure();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // Selection state
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedWidth, setSelectedWidth] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);

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
                    const firstVariant = data.variants.find(v => v.stock > 0) || data.variants[0];
                    setSelectedColor(firstVariant.color);
                    setSelectedWidth(firstVariant.width);
                    setSelectedSize(firstVariant.size);
                    setSelectedVariant(firstVariant);
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

    // Update variant when selection changes
    useEffect(() => {
        if (product && product.variants) {
            const variant = product.variants.find(v =>
                v.color === selectedColor &&
                v.width === selectedWidth &&
                v.size === selectedSize
            );
            if (variant) {
                setSelectedVariant(variant);
            }
        }
    }, [selectedColor, selectedWidth, selectedSize, product]);

    const handleAddToCart = (shouldNavigate = false) => {
        if (!isAuthenticated) {
            onAuthOpen();
            return;
        }

        if (!selectedSize) {
            toast({
                title: t('product.select_size'),
                status: "warning",
                duration: 2000,
                isClosable: true,
            });
            return;
        }

        if (shouldNavigate) {
            onQuickBuyOpen();
        } else {
            addToCart(product, selectedVariant, quantity);
            // toast({
            //     title: t('Added item to cart'),
            //     status: "success",
            //     duration: 2000,
            //     isClosable: true,
            // });
        }
    };

    const ServiceFeatures = () => (
        <SimpleGrid columns={2} spacing={4} mt={6}>
            <Flex align="center" gap={3} p={3} bg="blue.50" borderRadius="xl">
                <Icon as={FaUndo} color="blue.600" />
                <Box>
                    <Text fontSize="xs" fontWeight="bold">30-Day Returns</Text>
                    <Text fontSize="10px" color="gray.500">Risk-free shopping</Text>
                </Box>
            </Flex>
            <Flex align="center" gap={3} p={3} bg="green.50" borderRadius="xl">
                <Icon as={FaTruckMoving} color="green.600" />
                <Box>
                    <Text fontSize="xs" fontWeight="bold">Free 2-Way Shipping</Text>
                    <Text fontSize="10px" color="gray.500">We absorb all costs</Text>
                </Box>
            </Flex>
            <Flex align="center" gap={3} p={3} bg="purple.50" borderRadius="xl">
                <Icon as={FaShieldAlt} color="purple.600" />
                <Box>
                    <Text fontSize="xs" fontWeight="bold">Genuine Product</Text>
                    <Text fontSize="10px" color="gray.500">100% Authentic</Text>
                </Box>
            </Flex>
            <Flex align="center" gap={3} p={3} bg="orange.50" borderRadius="xl">
                <Icon as={FaClock} color="orange.600" />
                <Box>
                    <Text fontSize="xs" fontWeight="bold">Fast Delivery</Text>
                    <Text fontSize="10px" color="gray.500">Get it in {selectedVariant?.deliverySLA || '24H'}</Text>
                </Box>
            </Flex>
        </SimpleGrid>
    );

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

    const uniqueColors = [...new Set(product.variants.map(v => v.color))];
    const uniqueWidths = [...new Set(product.variants.filter(v => v.color === selectedColor).map(v => v.width))];
    const availableSizes = product.variants.filter(v => v.color === selectedColor && v.width === selectedWidth);

    return (
        <Box>
            <Box maxW="1200px" mx="auto" p={6}>
                <Breadcrumb mb={10} fontSize="xs" color="gray.400" textTransform="uppercase" letterSpacing="widest">
                    <BreadcrumbItem><BreadcrumbLink as={RouterLink} to="/">{t('navbar.home')}</BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage color="gray.800" fontWeight="600"><BreadcrumbLink>{product.title}</BreadcrumbLink></BreadcrumbItem>
                </Breadcrumb>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={16}>
                    <MotionBox initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <Box borderRadius="2xl" overflow="hidden" boxShadow="2xl">
                            <Image src={product.images[0]} alt={product.title} w="100%" h="auto" objectFit="cover" />
                        </Box>
                    </MotionBox>

                    <MotionStack spacing={6} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <Box>
                            <Flex align="center" justify="space-between">
                                <Text fontSize="xs" fontWeight="700" color="#0076BD">{product.brand}</Text>
                                <HStack spacing={1} cursor="pointer" onClick={() => document.getElementById('reviews-section').scrollIntoView({ behavior: 'smooth' })}>
                                    <Icon as={FaStar} color="orange.400" />
                                    <Text fontWeight="bold" fontSize="sm">{product.rating}</Text>
                                    <Text color="gray.400" fontSize="sm">({product.reviewCount} Reviews)</Text>
                                </HStack>
                            </Flex>
                            <Heading as="h1" size="lg" mt={2} color="#003977">{product.title}</Heading>
                            <Flex align="center" mt={4} gap={6}>
                                <Text fontSize="3xl" fontWeight="800">${selectedVariant?.price}</Text>
                                <Badge colorScheme="green" variant="subtle">Free Shipping & Returns</Badge>
                            </Flex>
                        </Box>

                        <ServiceFeatures />

                        <FitVisualizer fit={product.fit_recommendation} />

                        <Stack spacing={4}>
                            {/* Color Selection */}
                            <Box>
                                <Text fontSize="sm" fontWeight="800" mb={3} color="gray.600">{t('product.color')}: {selectedColor}</Text>
                                <HStack spacing={3}>
                                    {uniqueColors.map(color => (
                                        <Button
                                            key={color}
                                            onClick={() => {
                                                setSelectedColor(color);
                                                // Reset width if the new color doesn't have the selected width
                                                const hasWidth = product.variants.some(v => v.color === color && v.width === selectedWidth);
                                                if (!hasWidth) {
                                                    const firstWidth = product.variants.find(v => v.color === color).width;
                                                    setSelectedWidth(firstWidth);
                                                }
                                            }}
                                            variant={selectedColor === color ? "solid" : "outline"}
                                            colorScheme={selectedColor === color ? "blue" : "gray"}
                                            size="sm"
                                            borderRadius="full"
                                            px={6}
                                        >
                                            {color}
                                        </Button>
                                    ))}
                                </HStack>
                            </Box>

                            {/* Width Selection */}
                            {uniqueWidths.length > 1 && (
                                <Box>
                                    <Text fontSize="sm" fontWeight="800" mb={3} color="gray.600">{t('product.width')}</Text>
                                    <HStack spacing={3}>
                                        {uniqueWidths.map(width => (
                                            <Button
                                                key={width}
                                                onClick={() => setSelectedWidth(width)}
                                                variant={selectedWidth === width ? "solid" : "outline"}
                                                colorScheme={selectedWidth === width ? "blue" : "gray"}
                                                size="sm"
                                                borderRadius="full"
                                            >
                                                {width}
                                            </Button>
                                        ))}
                                    </HStack>
                                </Box>
                            )}

                            {/* Size Selection */}
                            <Box>
                                <Flex justify="space-between" align="center" mb={3}>
                                    <Text fontSize="sm" fontWeight="800" color="gray.600">{t('product.select_size')}</Text>
                                    <Text fontSize="xs" color="#0076BD" fontWeight="bold" cursor="pointer">Size Chart</Text>
                                </Flex>
                                <SimpleGrid columns={5} spacing={2}>
                                    {availableSizes.map((v) => (
                                        <Button
                                            key={v.sku}
                                            variant={selectedSize === v.size ? "solid" : "outline"}
                                            colorScheme={selectedSize === v.size ? "blue" : "gray"}
                                            isDisabled={v.stock === 0}
                                            onClick={() => { setSelectedSize(v.size); setSelectedVariant(v); }}
                                            borderRadius="md"
                                            h="40px"
                                            fontSize="sm"
                                            fontWeight="bold"
                                        >
                                            {v.size}
                                        </Button>
                                    ))}
                                </SimpleGrid>
                            </Box>

                            {/* Quantity Selection */}
                            <Box pt={4}>
                                <Text fontSize="sm" fontWeight="800" mb={3} color="gray.600">{t('product.quantity')}</Text>
                                <HStack maxW="150px" bg="gray.50" borderRadius="xl" p={1}>
                                    <IconButton
                                        icon={<FaMinus />}
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        isDisabled={quantity <= 1}
                                        aria-label="Decrease quantity"
                                    />
                                    <Text flex="1" textAlign="center" fontWeight="bold">{quantity}</Text>
                                    <IconButton
                                        icon={<FaPlus />}
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setQuantity(Math.min(selectedVariant?.stock || 99, quantity + 1))}
                                        isDisabled={quantity >= (selectedVariant?.stock || 99)}
                                        aria-label="Increase quantity"
                                    />
                                </HStack>
                            </Box>
                        </Stack>

                        <Divider my={4} />

                        <SimpleGrid columns={2} spacing={4}>
                            <Button
                                bg="#003977" color="white" size="lg" h="55px" borderRadius="xl"
                                onClick={() => handleAddToCart(false)} isDisabled={selectedVariant?.stock === 0}
                                leftIcon={<Icon as={TbShoppingBagPlus} />}
                                _hover={{ bg: "#002b5a", transform: "translateY(-2px)" }}
                                transition="all 0.2s"
                            >
                                {selectedVariant?.stock === 0 ? t('product.out_of_stock') : t('product.add_to_bag')}
                            </Button>
                            <Button
                                bg="#0076BD" color="white" size="lg" h="55px" borderRadius="xl"
                                onClick={() => handleAddToCart(true)} isDisabled={selectedVariant?.stock === 0}
                                _hover={{ bg: "#005a91", transform: "translateY(-2px)" }}
                                transition="all 0.2s"
                                fontWeight="bold"
                            >
                                {t('product.buy_now')}
                            </Button>
                        </SimpleGrid>
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
            <Footer />
            <AuthModal isOpen={isAuthOpen} onClose={onAuthClose} />
            <QuickBuyDrawer
                isOpen={isQuickBuyOpen}
                onClose={onQuickBuyClose}
                selectedItem={{ ...product, size: selectedVariant?.size }}
            />
        </Box>
    );
}

export default ProductDetails;
