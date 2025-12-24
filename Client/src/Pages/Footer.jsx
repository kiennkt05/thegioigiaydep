import { Box, Grid, GridItem, Text, Link, Icon } from '@chakra-ui/react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <Box as="footer" bg="white" p={8} borderTop="1px solid #ddd" mt={10}>
      <Grid 
        templateColumns={{ base: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }} 
        gap={6}
      >
        <GridItem>
          <Text fontWeight="bold">About Zappos</Text>
          <Link href="#">About</Link>
          <br />
          <Link href="#">Zappos ONE</Link>
          <br />
          <Link href="#">Zappos for Good</Link>
          <br />
          <Link href="#">Zappos at Work</Link>
          <br />
          <Link href="#">Get the Zappos Mobile App</Link>
          <br />
          <Link href="#">Amazon Prime Benefits</Link>
          <br />
          <Link href="#">Zappos VIP Benefits</Link>
          <br />
          <Link href="#">Coupons & Sales</Link>
          <br />
          <Link href="#">Accessibility Statement</Link>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Customer Service</Text>
          <Link href="#">FAQs</Link>
          <br />
          <Link href="#">Contact Info</Link>
          <br />
          <Link href="#">¿Ayuda en español?</Link>
          <br />
          <Link href="#">Shipping And Returns Policy</Link>
          <br />
          <Link href="#">About Proposition 65</Link>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Resources</Text>
          <Link href="#">Measurement Guide</Link>
          <br />
          <Link href="#">Size Conversion Chart</Link>
          <br />
          <Link href="#">Measure Your Bra Size</Link>
          <br />
          <Link href="#">Associates Program</Link>
          <br />
          <Link href="#">Jobs</Link>
          <br />
          <Link href="#">Press Kit & Brand Inquiries</Link>
          <br />
          <Link href="#">Site Map</Link>
          <br />
          <Link href="#">Take Survey</Link>
        </GridItem>

        <GridItem>
          <Text fontWeight="bold">Explore Zappos</Text>
          <Link href="#">Brands</Link>
          <br />
          <Link href="#">Clothing</Link>
          <br />
          <Link href="#">The Style Room</Link>
          <br />
          <Link href="#">Eyewear</Link>
          <br />
          <Link href="#">New Arrivals</Link>
          <br />
          <Link href="#">Running</Link>
          <br />
          <Link href="#">Jackets</Link>
          <br />
          <Link href="#">Shoes</Link>
          <br />
          <Link href="#">Watches</Link>
          <br />
          <Link href="#">Zappos Adaptive</Link>
          <br />
          <Link href="#">All Departments</Link>
        </GridItem>
      </Grid>

      <Box display="flex" justifyContent="center" mt={8} gap={4}>
        <Icon as={FaFacebook} boxSize={6} />
        <Icon as={FaInstagram} boxSize={6} />
      </Box>

      <Box mt={4} textAlign="center" fontSize="sm" color="gray.600">
        <Text>© 2009-2024 - Zappos.com LLC or its affiliates</Text>
        <Text mt={2}>
          <Link href="#">Terms of Use</Link> / <Link href="#">Privacy Policy</Link> / <Link href="#">Fur Policy</Link> / <Link href="#">Interest-Based Ads</Link> / 24/7 Customer Service (800) 927-7671
        </Text>
      </Box>
    </Box>
  );
};

export default Footer;
