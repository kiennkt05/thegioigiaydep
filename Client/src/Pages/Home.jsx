
import Footer from './Footer';
import TrendingNow from './TrendingNow';
import NewArrive from './NewArrive';
import Exclusives from './Exclusives';
import ShopSave from './ShopSave';
import JoinList from './JoinList';


import {
     Box,

     Center,
     Divider,
     Image,
     Text,
     Heading,


} from '@chakra-ui/react';




function Home() {


     return (
          <>


               <Divider />

               <Box p={5} m={5} >
                    <Image src='HeroImg.png' alt='Hero Image' />
                    <Center bg={"#F4EEE5"}>
                         <Heading fontSize='2xl'>Head-To-Toe Fall</Heading>
                    </Center>
                    <Center bg={"#F4EEE5"}>
                         <Text fontWeight={"bold"} color={"gray"}>Shops Womens Fall Favorites</Text>
                    </Center>
               </Box>

               <Divider orientation='horizontal' />



               <Box>
                    <TrendingNow />
               </Box>
               <Divider orientation='horizontal' />

               <Box>
                    <NewArrive />
               </Box>

               <Box>
                    <Exclusives />
               </Box>
               <Divider orientation='horizontal' />

               <Box>
                    <ShopSave />
               </Box>
               <Divider orientation='horizontal' />

               <Box>
                    <JoinList />
               </Box>
               <Divider orientation='horizontal' />

               <Box>
                    <Footer />
               </Box>
               <Divider />

          </>
     );
}

export default Home;
