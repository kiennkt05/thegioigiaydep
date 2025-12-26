import { useEffect, useState } from "react";
import { useSearchParams, Link as RouterLink } from "react-router-dom";
import {
  Box, Image, Badge, SimpleGrid, Divider, Heading,
  Button,
  Text,
  useToast,
  Flex,
  Select,
  HStack,
  Spinner,
  Center,
  LinkBox,
  LinkOverlay
} from '@chakra-ui/react';

import JoinList from "./JoinList";
import Footer from "./Footer";
import FilterSidebar from "../Components/FilterSidebar";
import ProductCard from "../Components/ProductCard";

function KidsProducts() {
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
      query.set('gender', 'kids');
      if (!query.has('page')) query.set('page', '1');

      const response = await fetch(`http://localhost:3000/api/products?${query.toString()}`);
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
              <Heading size="lg" color="#003977" mb={1}>Kids' Footwear</Heading>
              <Text fontSize="sm" color="gray.600" fontWeight="medium">{totalProducts} items found</Text>
            </Box>
            <HStack>
              <Text whiteSpace="nowrap">Sort By:</Text>
              <Select w="200px" value={filters.sort || ''} onChange={handleSortChange}>
                <option value="">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
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
                    <ProductCard key={product._id} product={product} />
                  ))
                ) : (
                  <Center w="100%" gridColumn="1 / -1" h="200px">
                    <Text fontSize="xl" color="gray.500">No products match your filters.</Text>
                  </Center>
                )}
              </SimpleGrid>

              {/* Pagination */}
              {totalPages > 1 && (
                <HStack justify="center" mt={10} spacing={2} wrap="wrap">
                  <Button
                    isDisabled={filters.page === '1' || !filters.page}
                    onClick={() => handlePageChange(Number(filters.page || 1) - 1)}
                  >
                    Prev
                  </Button>
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      colorScheme={(filters.page || '1') === (i + 1).toString() ? 'blue' : 'gray'}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    isDisabled={Number(filters.page || 1) === totalPages}
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
      <JoinList />
      <Footer />
    </Box>
  );
}

export default KidsProducts;



