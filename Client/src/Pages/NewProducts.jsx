import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box, Heading, SimpleGrid, Divider,
  Button,
  Text,
  useToast,
  Flex,
  HStack,
  Select,
  Spinner,
  Center
} from '@chakra-ui/react';
import ProductCard from "../Components/ProductCard";
import FilterSidebar from "../Components/FilterSidebar";
import Footer from "./Footer";

function NewProducts() {
  const [data, setData] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(searchParams);
      if (!query.has('page')) query.set('page', '1');

      const response = await fetch(`http://localhost:3000/api/new_arrivals?${query.toString()}`);
      const resData = await response.json();

      setData(resData.products || []);
      setTotalProducts(resData.totalProducts || 0);
      setTotalPages(resData.totalPages || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  const handleFilterChange = (keyOrUpdates, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (typeof keyOrUpdates === 'object') {
      Object.entries(keyOrUpdates).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') newParams.set(k, v);
        else newParams.delete(k);
      });
    } else {
      if (value) newParams.set(keyOrUpdates, value);
      else newParams.delete(keyOrUpdates);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSortChange = (e) => {
    handleFilterChange('sort', e.target.value);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage);
    setSearchParams(newParams);
  };

  const filters = Object.fromEntries(searchParams.entries());

  return (
    <Box>
      <Flex minH="100vh">
        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />

        <Box flex="1" p={5} minW="0">
          <Flex justify="space-between" align="center" mb={6}>
            <Box>
              <Heading size="lg" color="#003977" mb={1}>New Arrivals</Heading>
              <Text fontSize="sm" color="gray.600" fontWeight="medium">{totalProducts} items found</Text>
            </Box>
            <HStack>
              <Text whiteSpace="nowrap">Sort By:</Text>
              <Select w="200px" value={filters.sort || ''} onChange={handleSortChange}>
                <option value="">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </Select>
            </HStack>
          </Flex>

          {loading ? (
            <Center h="400px">
              <Spinner size="xl" color="blue.500" thickness="4px" />
            </Center>
          ) : (
            <>
              <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing={6}>
                {data.length > 0 ? (
                  data.map((product) => (
                    <ProductCard key={product._id} product={
                      product.images ? product : {
                        ...product,
                        images: [product.img],
                        variants: [{ price: product.price }]
                      }
                    } />
                  ))
                ) : (
                  <Center w="100%" h="200px">
                    <Text fontSize="xl" fontWeight="bold" textAlign="center" color="gray.500">
                      Products not available
                    </Text>
                  </Center>
                )}
              </SimpleGrid>

              {/* Pagination */}
              {totalPages > 1 && (
                <HStack justify="center" mt={10} spacing={2} wrap="wrap">
                  <Button
                    isDisabled={(filters.page || '1') === '1'}
                    onClick={() => handlePageChange(Number(filters.page || 1) - 1)}
                  >
                    Prev
                  </Button>
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      colorScheme={(filters.page || '1') === (i + 1).toString() ? 'blue' : 'gray'}
                      variant={(filters.page || '1') === (i + 1).toString() ? 'solid' : 'outline'}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    isDisabled={(filters.page || '1') === totalPages.toString()}
                    onClick={() => handlePageChange(Number(filters.page || 1) + 1)}
                  >
                    Next
                  </Button>
                </HStack>
              )}
            </>
          )}
        </Box>
      </Flex>

      <Divider mt={10} />
      <Footer />
    </Box>
  );
}

export default NewProducts;
