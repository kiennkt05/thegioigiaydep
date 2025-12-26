import { SimpleGrid, Box, Heading, Flex, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../Components/ProductCard";
import { FaArrowRight } from "react-icons/fa";

function Exclusives() {
     const [data, setData] = useState([]);

     const fetchData = async () => {
          try {
               const api = await fetch('http://localhost:3000/api/special_products');
               const res = await api.json();
               setData(res.products || res);
          } catch (error) {
               console.log("Fetch error:", error);
          }
     };

     useEffect(() => {
          fetchData();
     }, []);

     return (
          <Box py={10} bg="blue.50" borderRadius="3xl" my={10} px={5}>
               <Flex boxSize="full" justify="space-between" align="center" mb={8}>
                    <Heading size="lg" color="#003977">Zappos Birthday Exclusives</Heading>
                    <Button as={Link} to="/exclusives" variant="ghost" rightIcon={<FaArrowRight />} colorScheme="blue">
                         View All
                    </Button>
               </Flex>
               <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing={6}>
                    {data.slice(0, 4).map((product) => (
                         <ProductCard key={product._id} product={product} />
                    ))}
               </SimpleGrid>
          </Box>
     );
}

export default Exclusives;
