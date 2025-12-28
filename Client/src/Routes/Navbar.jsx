import { Link as ChakraLink, Flex, Box, Center, Heading } from "@chakra-ui/react";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useColorModeValue, List, ListItem, ListIcon } from "@chakra-ui/react";
import { useTranslation } from 'react-i18next';

import AuthForm from "../Pages/AuthForm"
import { useAuth } from "../Context/AuthContext";
import { FaRegUserCircle, FaSignOutAlt, FaHistory, FaBars } from "react-icons/fa"
import {
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Button,
    Image,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverCloseButton,
    PopoverArrow,
    PopoverBody,
} from '@chakra-ui/react';


import { FaSearch } from 'react-icons/fa'
import { Badge, Menu, MenuButton, MenuList, MenuItem, Text, Divider } from '@chakra-ui/react';
import { useCart } from "../Context/CartContext";
import { TbShoppingBagPlus } from "react-icons/tb"

const navLinks = [
    { to: '/', label: "Home" },
    { to: '/new', label: "New" },
    { to: '/trending', label: "Trending" },
    { to: '/exclusives', label: "Exclusives" },
    { to: '/womans', label: "Womens" },
    { to: '/mens', label: "Mens" },
    { to: '/kids', label: "Kids" },
];

function Navbar() {
    const { t, i18n } = useTranslation();
    const { cartCount } = useCart();
    const { user, isAuthenticated, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();
    const suggestionsRef = useRef(null);

    // Debounced search for suggestions
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.length >= 2) {
                fetchSuggestions();
            } else {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Handle clicks outside of suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchSuggestions = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/products/suggestions?q=${searchQuery}`);
            const data = await res.json();
            setSuggestions(data);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Failed to fetch suggestions:", error);
        }
    };

    const handleSearch = (e) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            navigate(`/mens?q=${searchQuery}`); // Default to category or a search page
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion.title);
        setShowSuggestions(false);
        navigate(`/product/${suggestion._id}`);
    };
    return (
        <Box>


            <Box position="sticky" top="0" zIndex="sticky" bg="white">
                <Flex
                    p={4}
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                    boxShadow="0 2px 10px rgba(0,0,0,0.05)"
                    bg="white"
                >
                    <Box display={"flex"} gap={3} alignItems={"center"} paddingLeft={7}>
                        <Box fontSize="xl" fontWeight="bold" color="black">
                            <Image src='/logo.png' alt='Logo' h="65px" />
                        </Box>

                        <Box position="relative" flex="1">
                            <InputGroup minW="650px" flex="1" mx={5}>
                                <InputLeftElement pointerEvents="none">
                                    <FaSearch color="gray.300" />
                                </InputLeftElement>
                                <Input
                                    type="text"
                                    placeholder={t('navbar.search_placeholder')}
                                    bg="gray.50"
                                    border="none"
                                    borderRadius="full"
                                    _focus={{ bg: "white", boxShadow: "0 0 0 2px #0076BD", width: "110%" }}
                                    transition="all 0.3s"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                    onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                                />
                            </InputGroup>

                            {showSuggestions && suggestions.length > 0 && (
                                <Box
                                    ref={suggestionsRef}
                                    position="absolute"
                                    top="100%"
                                    left="20px"
                                    right="20px"
                                    className="glass"
                                    boxShadow="2xl"
                                    zIndex="popover"
                                    borderRadius="xl"
                                    mt={2}
                                    overflow="hidden"
                                    animation="fadeIn 0.3s ease-out"
                                >
                                    <List spacing={0}>
                                        {suggestions.map((item) => (
                                            <ListItem
                                                key={item._id}
                                                px={4}
                                                py={2}
                                                _hover={{ bg: "gray.100", cursor: "pointer" }}
                                                onClick={() => handleSuggestionClick(item)}
                                                display="flex"
                                                alignItems="center"
                                            >
                                                <ListIcon as={FaSearch} color="gray.400" />
                                                <Box>
                                                    <Text fontWeight="bold" fontSize="sm">{item.title}</Text>
                                                    <Text fontSize="xs" color="gray.500">{item.brand} • {item.category}</Text>
                                                </Box>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}
                        </Box>
                    </Box>

                    <Flex alignItems="center" gap={1}>

                        {isAuthenticated ? (
                            <Menu>
                                <MenuButton as={Button} variant="ghost" leftIcon={<FaRegUserCircle fontSize="2rem" />}>
                                    <Text fontSize="sm" fontWeight="bold">{user?.name}</Text>
                                </MenuButton>
                                <MenuList>
                                    <MenuItem as={Link} to="/orders" icon={<FaHistory />}>
                                        {t('navbar.order_history')}
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem icon={<FaSignOutAlt />} onClick={logout}>
                                        {t('navbar.sign_out')}
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                        ) : (
                            <Popover>
                                <PopoverTrigger>
                                    <Button variant="ghost" leftIcon={<FaRegUserCircle fontSize="2rem" />} />
                                </PopoverTrigger>
                                <PopoverContent>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverBody>
                                        <AuthForm />
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>
                        )}
                        <Button as={Link} to="/cart" variant="ghost" leftIcon={<TbShoppingBagPlus fontSize="2rem" />}>
                            {cartCount > 0 && (
                                <Badge
                                    ml="-2"
                                    mt="-2"
                                    colorScheme="red"
                                    borderRadius="full"
                                    variant="solid"
                                    fontSize="0.8rem"
                                >
                                    {cartCount}
                                </Badge>
                            )}
                        </Button>

                        {/* Language Switcher */}
                        <Menu>
                            <MenuButton
                                as={Button}
                                variant="ghost"
                                size="sm"
                                fontSize="xs"
                                fontWeight="800"
                                aria-label="Switch Language"
                            >
                                {i18n.language?.split('-')[0].toUpperCase()}
                            </MenuButton>
                            <MenuList minW="100px">
                                <MenuItem onClick={() => i18n.changeLanguage('en')} fontSize="sm" fontWeight="bold">
                                    English (EN)
                                </MenuItem>
                                <MenuItem onClick={() => i18n.changeLanguage('vi')} fontSize="sm" fontWeight="bold">
                                    Tiếng Việt (VI)
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </Flex>

                {/* Desktop Navigation */}
                <Flex as="nav" px={10} py={2} gap={6} justifyContent="center" borderBottom="1px solid" borderColor="gray.100" display={{ base: "none", md: "flex" }}>
                    {navLinks.map((el) => (
                        <ChakraLink
                            as={Link}
                            to={el.to}
                            key={el.to}
                            px={3}
                            py={1}
                            fontSize="sm"
                            fontWeight={"500"}
                            color="gray.600"
                            _hover={{ color: "#0076BD", textDecor: "none" }}
                            transition="color 0.2s"
                        >
                            {t(`navbar.${el.label.toLowerCase()}`)}
                        </ChakraLink>
                    ))}
                </Flex>

                {/* Mobile Navigation */}
                <Flex display={{ base: "flex", md: "none" }} justifyContent="center" py={2} borderBottom="1px solid" borderColor="gray.100">
                    <Menu>
                        <MenuButton
                            as={IconButton}
                            aria-label="Options"
                            icon={<FaBars />}
                            variant="ghost"
                            color="#003977"
                        />
                        <MenuList>
                            {navLinks.map((el) => (
                                <MenuItem as={Link} to={el.to} key={el.to} fontWeight="500">
                                    {el.label}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                </Flex>
            </Box>
        </Box>
    );
}

export default Navbar;
