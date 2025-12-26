import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Flex, Heading, Button, SimpleGrid } from "@chakra-ui/react";
import ProductCard from "../Components/ProductCard";
import { FaArrowRight } from "react-icons/fa";

function TrendingNow() {
     const [data, setData] = useState([]);

     const fetchData = async () => {
          try {
               const api = await fetch('http://localhost:3000/api/trending_now');
               const res = await api.json();
               // Assuming trending_now API returns product objects. 
               // If it returns a partial object, we map it or wrap it.
               setData(res.products || res);
          } catch (error) {
               console.log("Fetch error:", error);
          }
     };

     useEffect(() => {
          fetchData();
     }, []);

     return (
          <Box py={10}>
               <Flex boxSize="full" justify="space-between" align="center" mb={8} px={5}>
                    <Heading size="lg" color="#003977">Trending Now</Heading>
                    <Button as={Link} to="/trending" variant="ghost" rightIcon={<FaArrowRight />} colorScheme="blue">
                         View All
                    </Button>
               </Flex>
               <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing={6} px={5}>
                    {data.slice(0, 4).map((product) => (
                         <ProductCard key={product._id} product={product} />
                    ))}
               </SimpleGrid>
          </Box>
     );
}

export default TrendingNow;
