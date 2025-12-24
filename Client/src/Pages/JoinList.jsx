
import { Box, Button, Flex, Heading, Input, Text } from '@chakra-ui/react';

const JoinList = () => {
  return (
    <Box bg="#E7F4FF" p={10} mx="auto" width="100%" margin={4}>
      <Heading fontSize="2xl" fontWeight="bold" p={1}>
        Join Our List, Get 10% Off
      </Heading>
      <Text fontSize="sl" p={1}>
        Sign up for Zappos emails—new subscribers get 10% off a future order!* Plus, get early
        access to sales, coupons, and more. (One code per email address.)
      </Text>
      <Text fontSize="sl" padding={1}>
        access to sales, coupons, and more. (One code per email address.)
      </Text>
      <Flex width="50%" mt={4} alignItems="center" p={5}>
        <Input variant="outline" placeholder="Email Address" mr={2} p={7}/>
        <Button bg={"black"} color={"white"} variant="solid" p={7}>
          Join the Party
        </Button>
      </Flex>
    </Box>
  );
};

export default JoinList;