import { Image, SimpleGrid, Flex, Box, Badge, Divider, } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';

function NewArrive() {
     const [data, setData] = useState([]);

     const fetchData = async () => {
          try {
               const api = await fetch("http://localhost:3000/api/new_arrivals");
               const finalRes = await api.json();
               setData(finalRes);
          } catch (error) {
               console.log("Fetch error:", error);
          }
     };

     useEffect(() => {
          fetchData();
     }, []);

     return (
          <>
              
               <Flex mx="auto" justifyContent="center" alignItems="center" p={5} width="95%" >
                    <SimpleGrid
                         width="95%"
                         maxWidth="1200px"
                         spacing={4}
                         templateColumns='repeat(auto-fit, minmax(280px, 1fr))'

                         gap={5}

                    >
                         {data.map((property) => (
                              <Box key={property._id} bg={"#F5F5F5"}
                                   m={2}
                                   maxW='sl'
                                   borderWidth='1px'
                                   borderRadius='lg'
                                   overflow='hidden'
                                   height="400px" // Set a fixed height or adjust as needed
                              >
                                   <Image src={property.img} alt={property.title} />

                                   <Box p='3' height="100%" >
                                        <Box display='flex' alignItems='baseline'>
                                             <Badge borderRadius='full' px='2' colorScheme='teal'>
                                                  New
                                             </Badge>
                                             <Box
                                                  color='gray.500'
                                                  fontWeight='semibold'
                                                  letterSpacing='wide'
                                                  fontSize='xs'
                                                  textTransform='uppercase'
                                                  ml='2'
                                             >
                                             </Box>
                                        </Box>

                                        <Box
                                             mt='1'
                                             fontWeight='semibold'
                                             as='h3'
                                             lineHeight='tight'
                                             noOfLines={1}
                                        >
                                             {property.title}
                                        </Box>

                                        <Box>
                                             {property.category}
                                        </Box>
                                        <Box fontWeight={"bold"}>
                                             $ {property.price}
                                        </Box>


                                        <Box display='flex' mt='2' alignItems='center'>
                                             {Array(5).fill('').map((_, i) => (
                                                  <Box key={i} color={"gold"}>
                                                       <FaStar
                                                            color={i < property.rating ? 'teal.500' : 'gray.300'}
                                                       />
                                                  </Box>
                                             ))}
                                             <Box textAlign={"center"} as='span' ml='2' color='gray.600' fontSize='sm'>
                                                  {property.reviewCount}
                                             </Box>
                                        </Box>
                                   </Box>
                              </Box>
                         ))}
                    </SimpleGrid>
               </Flex>
               <Divider />
          </>
     );
}

export default NewArrive;
