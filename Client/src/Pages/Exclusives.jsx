import { useState, useEffect } from "react"
import { SimpleGrid, Image,  Box, Divider, Heading } from "@chakra-ui/react";
import { Card, CardBody, CardFooter } from '@chakra-ui/react'

function Exclusives() {
     const [data, setData] = useState([])

     const fetchData = async () => {
          try {
               const api = await fetch('http://localhost:3000/api/special_products');
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

               <Box p={5} width="95%" mx="auto" >
                    <Heading size='xl' m={2}>Zappos 25th Birthday Exclusives</Heading>
                    <SimpleGrid p={5} justifyContent="space-evenly" spacing={5} templateColumns="repeat(auto-fill, minmax(300px, 1fr))">
                         {data.map((elm) => (
                              <Card key={elm._id} p={1} bg='#F6F6F6'>
                                   <CardBody>
                                        <Image src={elm.img} alt={elm.title} />
                                   </CardBody>
                                   <CardFooter>
                                        <Heading  size='md'>
                                             {elm.title}
                                        </Heading>
                                   </CardFooter>
                                   <CardFooter>
                                        <Heading  size='sl' color={"gray"}>
                                             {elm.category}
                                        </Heading>
                                   </CardFooter>
                                   <Heading size='md'marginLeft={5}>
                                        ${elm.price}
                                   </Heading>
                              </Card>
                         ))}
                    </SimpleGrid>
               </Box>
               <Divider />
          </>
     )


}

export default Exclusives
