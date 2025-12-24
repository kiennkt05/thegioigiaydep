import { useState } from "react";
import { Box, Button, Heading, VStack } from "@chakra-ui/react";
import AuthForm from "./AuthForm";



function MainComponent() {
  const [showNewComponent, setShowNewComponent] = useState(false);

  const handleButtonClick = () => {
    setShowNewComponent(true);
  };

  return (
    <Box maxWidth="400px" mx="auto" mt="50px" p={6} borderWidth="1px" borderRadius="md" boxShadow="lg">
      <VStack spacing={4}>
        <Heading size="lg">Main Component</Heading>
        <Button colorScheme="teal" width="full" onClick={handleButtonClick}>
          Open New Component
        </Button>
        {/* Conditionally render the new component */}
        {showNewComponent && <AuthForm/>}
      </VStack>
    </Box>
  );
}

export default MainComponent;
