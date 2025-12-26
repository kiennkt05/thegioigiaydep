import { memo } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
    Box,
    Image,
    Badge,
    Text,
    Flex,
    Button,
    LinkBox,
    LinkOverlay,
    Icon
} from '@chakra-ui/react';
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";

const MotionLinkBox = motion(LinkBox);

const ProductCard = memo(({ product }) => {
    return (
        <MotionLinkBox
            as="article"
            borderWidth="1px"
            borderRadius="xl"
            overflow="hidden"
            bg="white"
            _hover={{ shadow: '2xl', transform: 'translateY(-4px)' }}
            transition="all 0.3s ease"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
        >
            <Box position="relative" overflow="hidden">
                <Image
                    src={product.images[0]}
                    alt={product.title}
                    h="280px"
                    w="100%"
                    objectFit="cover"
                    loading="lazy"
                    transition="transform 0.5s ease"
                    _groupHover={{ transform: 'scale(1.08)' }}
                />
                <Box
                    position="absolute"
                    top="3"
                    right="3"
                    p="2"
                    bg="white"
                    borderRadius="full"
                    boxShadow="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                    _hover={{ color: "red.500" }}
                >
                    <Icon as={FaHeart} />
                </Box>
            </Box>

            <Box p="5">
                <Flex justify="space-between" align="center" mb={1}>
                    <Text fontSize="xs" color="gray.500" fontWeight="600" textTransform="uppercase" letterSpacing="widest">
                        {product.brand || "Zappos"}
                    </Text>
                    {product.tags && product.tags.length > 0 ? (
                        <Badge
                            borderRadius="full"
                            px="2"
                            colorScheme={
                                product.tags[0] === 'Sale' ? 'red' :
                                    product.tags[0] === 'Exclusive' ? 'purple' :
                                        product.tags[0] === 'Trending' ? 'orange' :
                                            'blue'
                            }
                            variant="subtle"
                            fontSize="2xs"
                        >
                            {product.tags[0]}
                        </Badge>
                    ) : (
                        <Badge borderRadius="full" px="2" colorScheme="blue" variant="subtle" fontSize="2xs">
                            New
                        </Badge>
                    )}
                </Flex>

                <Box mt="1" fontWeight="600" as="h4" lineHeight="tight" noOfLines={1} fontSize="md">
                    <LinkOverlay as={RouterLink} to={`/product/${product._id}`}>
                        {product.title}
                    </LinkOverlay>
                </Box>

                <Text color="gray.500" fontSize="sm" mt={1}>{product.category}</Text>

                <Flex align="center" mt={4} justify="space-between">
                    <Text fontWeight="700" fontSize="xl" color="#003977">${product.variants[0]?.price}</Text>
                    <Button
                        as={RouterLink}
                        to={`/product/${product._id}`}
                        colorScheme="blue"
                        size="sm"
                        borderRadius="full"
                        px={6}
                        variant="solid"
                        _hover={{ bg: "#003977" }}
                    >
                        View
                    </Button>
                </Flex>
            </Box>
        </MotionLinkBox>
    );
});

export default ProductCard;
