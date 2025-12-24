import { SimpleGrid, Image, Text, Box, Center, Divider, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Card, CardBody, CardFooter } from '@chakra-ui/react'
import { Link } from "react-router-dom";
import { } from '@chakra-ui/react'

function TrendingNow() {
     const [data, setData] = useState([]);

     const fetchData = async () => {
          try {
               const api = await fetch('http://localhost:3000/api/trending_now');
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
               <Box p={2} width="90%" mx="auto">
                    <Heading size='md' p={2}>Trending Now</Heading>
                    <SimpleGrid justifyContent="space-evenly" spacing={4} templateColumns="repeat(auto-fill, minmax(250px, 1fr))">
                         {data.map((elm) => (
                              <Card boxShadow='xs' rounded='md' bg='#F6F6F6' key={elm._id} p={2}>
                                   <CardBody>
                                        <Image src={elm.img} alt={elm.title} />
                                   </CardBody>
                                   <CardFooter>
                                        <Heading size={"sl"}>{elm.title}</Heading>
                                   </CardFooter>
                              </Card>
                         ))}
                    </SimpleGrid>
               </Box>



               <Box p={3} width="95%" mx="auto" >

                    <Heading size='md' marginLeft={7}>That Autumn Feeling</Heading>
                    <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(350px, 1fr))'>
                         <Card p={4} _hover={{ boxShadow: 'lg' }} boxShadow='base' rounded='md' bg='#F6F6F6'>

                              <CardBody >
                                   <Image boxSize={400} src="https://m.media-amazon.com/images/I/71aS2h6cocL._AC_SR920,736_.jpg" alt="" />
                              </CardBody>
                              <CardFooter >
                                   <Center><Heading color={"gray"} size={"sl"}>Intrepid Reflective Camo Snow Boots</Heading> </Center>
                              </CardFooter>
                              <Center><b>Shop Hunter</b></Center>
                         </Card>
                         <Card p={4} boxShadow='base' rounded='md' bg='#F6F6F6' >

                              <CardBody >
                                   <Image boxSize={400} src="https://m.media-amazon.com/images/I/71inCWL0GVL._AC_SR920,736_.jpg" alt="" />
                              </CardBody>
                              <CardFooter>
                                   <Center> <Heading color={"gray"}  size={"sl"}>90s-inspired heritage design</Heading></Center>
                              </CardFooter>
                              <Center><b>Shop Lifestyle Sneakers</b></Center>
                         </Card>
                         <Card p={4} boxShadow='base' rounded='md' bg='#F6F6F6'>

                              <CardBody>
                                   <Image boxSize={400} src="https://m.media-amazon.com/images/I/71GuK9UXG2L._AC_SR920,736_.jpg" alt="" />
                              </CardBody>
                              <CardFooter>
                                   <Center><Heading color={"gray"}  size={"sl"}>1460 Leather Lace-Up Boots</Heading></Center>
                              </CardFooter>
                              <Center><b>Shoes Lack Up Boots</b></Center>
                         </Card>

                    </SimpleGrid>
               </Box>
               <Divider />


               <Box h={200} width="95" bg={"#ADD5F2"} p={5} m={5}>
                    <Center>

                         <Heading size='xl'>Join VIP, Earn Rewards</Heading>

                    </Center>
                    <Center>
                         <Text fontWeight={"bold"}>
                              <br />
                              Sign up for SURPRISE rewards during Zappos VIP Days: 10/14/24 9am PT-10/18/24 11:59pm PT.
                              <br />

                              <Center>(Plus, get upgraded shipping just in time for the holidays!)</Center>
                         </Text>

                    </Center>
                    <Center>
                         <Link> Join VIP</Link>
                    </Center>
               </Box>
               <Divider />
               <Box>

                    <Image src="work.png" alt="" />
               </Box>
          </>


     );
}

export default TrendingNow;
