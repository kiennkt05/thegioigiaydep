import { Box, SimpleGrid, Image, Heading } from '@chakra-ui/react'

function ShopSave() {

     return (
          <>
              <Box mx="auto" width="95%" justifyItems="center" p={2}>
              <Heading size={"xl"}>Ways to Shop & Save!</Heading>
              <SimpleGrid columns={3} spacing={4} justifyItems="center" margin={6} >
                    <Box  p={5} borderRadius="md" boxShadow="md" bg="#F6F6F6">
                         <Image src="https://m.media-amazon.com/images/G/01/Zappos/VIP2024/VIP-VIP-110521-New.png" alt="" />
                    </Box>
                    <Box  p={5} borderRadius="md" boxShadow="md" bg="F6F6F6">
                         <Image src="https://m.media-amazon.com/images/G/01/Zappos/VIP2024/2-Prime_1-NEW.png" alt="" />
                    </Box>
                    <Box  p={5} borderRadius="md" boxShadow="md" bg="F6F6F6">
                         <Image src="https://m.media-amazon.com/images/G/01/Zappos/VIP2024/5Points-NEW.png" alt="" />
                    </Box>
               </SimpleGrid>

              </Box>

          </>
     )
}

export default ShopSave
