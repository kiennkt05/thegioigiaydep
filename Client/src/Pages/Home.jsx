import Footer from './Footer';
import TrendingNow from './TrendingNow';
import NewArrive from './NewArrive';
import Exclusives from './Exclusives';
import Hero from '../Components/Hero';
import CategorySection from '../Components/CategorySection';


import {
     Box,


     Divider,


} from '@chakra-ui/react';




function Home() {


     return (
          <Box bg="white">
               <Hero />

               <Box maxW="1280px" mx="auto">
                    <CategorySection />

                    <Divider />
                    <TrendingNow />

                    <Divider />
                    <NewArrive />

                    <Exclusives />

                    <Divider />

                    <Divider />
               </Box>

               <Footer />
          </Box>
     );
}

export default Home;
