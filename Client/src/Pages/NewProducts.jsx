import { useEffect, useState } from "react";
import {
  Box, Image, Badge, SimpleGrid, Divider,
  Button,
  Text,
  useToast,
} from '@chakra-ui/react';

import JoinList from "./JoinList";
import Footer from "./Footer";

function NewProducts() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast()
  const fetchData = async () => {
    try {
      const api = await fetch('http://localhost:3000/api/new_products');
      const finalRes = await api.json();
      setData(finalRes);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClick = () => {
    toast({
      title: 'Order Placed',
      description: 'Your order has been successfully placed!',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top',
    });
  };

  const filteredData = data.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>


      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4} width="90%" margin="10px auto">
        {filteredData.length > 0 ? (
          filteredData.map((property) => (
            <Box key={property._id} maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
              <Image src={property.img} alt={property.title} />

              <Box p="6">
                <Box display="flex" alignItems="baseline">
                  <Badge borderRadius="full" px="2" colorScheme="teal">New</Badge>
                </Box>

                <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight" noOfLines={1}>
                  {property.title}
                </Box>

                <Box mt="1" color={"gray"} fontWeight="semibold" as="h5" lineHeight="tight" noOfLines={1}>
                  {property.category}
                </Box>

                <Box>
                  {property.formattedPrice}
                  <Box as="span" fontWeight={"bold"} color="black" fontSize="sm">
                    ${property.price}
                  </Box>
                </Box>
              </Box>
              <Button marginLeft={2} marginBottom={2} size='sm' colorScheme='teal' onClick={handleClick} >
                Buy Now
              </Button>
            </Box>
          ))
        ) : (
          <Text fontSize="xl" fontWeight="bold" textAlign="center" margin="20px auto" color="gray.500">
            Products not available
          </Text>
        )}
      </SimpleGrid>

      <Divider />
      <Box>
        <JoinList />
      </Box>
      <Divider />
      <Box>
        <Footer />
      </Box>
      <Divider />
    </>
  );
}

export default NewProducts;
