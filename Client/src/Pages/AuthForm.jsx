import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import {
     Button,
     FormControl,
     FormLabel,
     Input,
     VStack,
     Modal,
     ModalOverlay,
     ModalContent,
     ModalHeader,
     ModalCloseButton,
     ModalBody,
     ModalFooter,
     useToast,
     Box,
     Image
} from "@chakra-ui/react";

function AuthModal({ isOpen: externalIsOpen, onClose: externalOnClose }) {
     const [localIsOpen, setLocalIsOpen] = useState(false);
     const isOpen = externalIsOpen !== undefined ? externalIsOpen : localIsOpen;
     const setIsOpen = externalOnClose !== undefined ? (val) => !val && externalOnClose() : setLocalIsOpen;

     const [isLoginMode, setIsLoginMode] = useState(false)
     const [name, setName] = useState("")
     const [email, setEmail] = useState("")
     const [password, setPassword] = useState("")
     const [phoneNumber, setPhoneNumber] = useState("")
     const { login, signup } = useAuth();
     const navigate = useNavigate()

     const handleSignUp = async (e) => {
          e.preventDefault();
          const result = await signup({ name, email, password, phoneNumber });
          if (result.success) {
               setName("")
               setEmail("")
               setPassword("")
               setPhoneNumber("")
               setIsLoginMode(true)
          }
     };

     const handleLogin = async (e) => {
          e.preventDefault();
          const result = await login(email, password);
          if (result.success) {
               setIsOpen(false);
               navigate("/"); // or back to where they were
          }
     };

     return (
          <>
               {externalIsOpen === undefined && (
                    <Button onClick={() => setIsOpen(true)} >
                         Sign Up / Log In
                    </Button>
               )}

               <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                    <ModalOverlay />
                    <ModalContent>
                         <Box
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              height="8vh"
                              m={4}

                         >
                              <Image width="12rem"
                                   src="../public/logo.png"
                                   alt="Thegioigiaydep Logo"
                              />
                         </Box>
                         <ModalHeader fontWeight={"bold"} fontStyle={"initial"}>{isLoginMode ? "Log In" : "Please Register first"}</ModalHeader>
                         <ModalCloseButton />
                         <ModalBody>
                              <VStack spacing={4}>
                                   {!isLoginMode && (
                                        <form onSubmit={handleSignUp}>
                                             <FormControl isRequired>
                                                  <FormLabel>Name</FormLabel>
                                                  <Input
                                                       value={name}
                                                       onChange={(e) => setName(e.target.value)}
                                                       placeholder="Enter your name"
                                                  />
                                             </FormControl>
                                             <FormControl isRequired>
                                                  <FormLabel>Email</FormLabel>
                                                  <Input
                                                       type="email"
                                                       value={email}
                                                       onChange={(e) => setEmail(e.target.value)}
                                                       placeholder="Enter your email"
                                                  />
                                             </FormControl>
                                             <FormControl isRequired>
                                                  <FormLabel>Phone Number</FormLabel>
                                                  <Input
                                                       type="tel"
                                                       value={phoneNumber}
                                                       onChange={(e) => setPhoneNumber(e.target.value)}
                                                       placeholder="Enter your phone number"
                                                  />
                                             </FormControl>
                                             <FormControl isRequired>
                                                  <FormLabel>Password</FormLabel>
                                                  <Input
                                                       type="password"
                                                       value={password}
                                                       onChange={(e) => setPassword(e.target.value)}
                                                       placeholder="Enter your password"
                                                  />
                                             </FormControl>
                                             <Button mt={4} colorScheme="teal" type="submit" width="full">
                                                  Sign Up
                                             </Button>
                                             <Button
                                                  mt={2}
                                                  variant="link"
                                                  onClick={() => setIsLoginMode(true)}
                                             >
                                                  Already have an account? Log In
                                             </Button>
                                        </form>
                                   )}

                                   {isLoginMode && (
                                        <form onSubmit={handleLogin}>
                                             <FormControl isRequired>
                                                  <FormLabel>Email</FormLabel>
                                                  <Input
                                                       value={email}
                                                       onChange={(e) => setEmail(e.target.value)}
                                                       placeholder="Enter your email"
                                                  />
                                             </FormControl>
                                             <FormControl isRequired>
                                                  <FormLabel>Password</FormLabel>
                                                  <Input
                                                       type="password"
                                                       value={password}
                                                       onChange={(e) => setPassword(e.target.value)}
                                                       placeholder="Enter your password"
                                                  />
                                             </FormControl>
                                             <Button mt={4} colorScheme="teal" type="submit" width="full">
                                                  Log In
                                             </Button>
                                             <Button
                                                  mt={2}
                                                  variant="link"
                                                  onClick={() => setIsLoginMode(false)}
                                             >
                                                  Don't have an account? Sign Up
                                             </Button>
                                        </form>
                                   )}
                              </VStack>
                         </ModalBody>

                         <ModalFooter>
                              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                                   Close
                              </Button>
                         </ModalFooter>
                    </ModalContent>
               </Modal>
          </>
     );
}

export default AuthModal;
