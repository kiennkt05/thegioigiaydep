import Footer from './Footer';
import TrendingNow from './TrendingNow';
import NewArrive from './NewArrive';
import Exclusives from './Exclusives';
import ShopSave from './ShopSave';
import JoinList from './JoinList';
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
                    <ShopSave />

                    <Divider />
                    <Box py={10}>
                         <JoinList />
                    </Box>
               </Box>

               <Footer />
          </Box>
     );
}

export default Home;
