import {
    Box,
    Flex,
    Heading,
    Text,
    Stack,
    Icon,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    Avatar,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Button,
    useToast,
    Spinner,
    Center,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    Select as ChakraSelect,
    HStack,
} from "@chakra-ui/react";
import { FaBox, FaShoppingBag, FaUsers, FaChartLine, FaEllipsisV, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { useEffect, useState } from "react";

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const fetchStats = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/admin/stats');
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchOrders = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/admin/orders');
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/admin/products');
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            const res = await fetch(`http://localhost:3000/api/admin/products/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                toast({ title: "Product deleted", status: "success", duration: 2000 });
                fetchProducts();
                fetchStats();
            }
        } catch (error) {
            toast({ title: "Error deleting product", status: "error" });
        }
    };

    const handleAddProduct = async (productData) => {
        try {
            const res = await fetch('http://localhost:3000/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            if (res.ok) {
                toast({ title: "Product added", status: "success", duration: 2000 });
                fetchProducts();
                fetchStats();
                onClose();
            }
        } catch (error) {
            toast({ title: "Error adding product", status: "error" });
        }
    };

    const updateOrderStatus = async (id, status) => {
        try {
            const res = await fetch(`http://localhost:3000/api/admin/orders/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                toast({ title: `Order ${status}`, status: "success", duration: 2000 });
                fetchOrders();
            }
        } catch (error) {
            toast({ title: "Error updating order", status: "error" });
        }
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await Promise.all([fetchStats(), fetchOrders(), fetchProducts()]);
            setLoading(false);
        };
        init();
    }, []);

    if (loading) return (
        <Center h="100vh">
            <Spinner size="xl" color="blue.500" thickness="4px" />
        </Center>
    );

    return (
        <Box p={8} bg="gray.50" minH="100vh">
            <Stack spacing={8}>
                <Flex justify="space-between" align="center">
                    <Box>
                        <Heading size="lg" color="#003977">Admin Dashboard</Heading>
                        <Text color="gray.500">Inventory & Order Management</Text>
                    </Box>
                    <Button leftIcon={<FaPlus />} colorScheme="blue" size="md" onClick={onOpen}>
                        Add Product
                    </Button>
                </Flex>

                <Tabs variant="enclosed" colorScheme="blue">
                    <TabList bg="white" p={2} borderRadius="xl" boxShadow="sm" border="none">
                        <Tab fontWeight="bold">Overview</Tab>
                        <Tab fontWeight="bold">Products ({products.length})</Tab>
                        <Tab fontWeight="bold">Orders ({orders.length})</Tab>
                    </TabList>

                    <TabPanels>
                        {/* Overview Panel */}
                        <TabPanel px={0} py={6}>
                            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6} mb={8}>
                                <StatCard label="Total Revenue" value={`$${stats?.totalRevenue}`} icon={FaChartLine} color="blue" />
                                <StatCard label="Orders" value={stats?.totalOrders} icon={FaShoppingBag} color="green" />
                                <StatCard label="Users" value={stats?.totalUsers} icon={FaUsers} color="purple" />
                                <StatCard label="Products" value={stats?.totalProducts} icon={FaBox} color="orange" />
                            </SimpleGrid>

                            <Box bg="white" p={8} borderRadius="2xl" boxShadow="sm">
                                <Heading size="md" mb={6}>Recent Orders</Heading>
                                <OrderTable orders={orders.slice(0, 5)} onUpdateStatus={updateOrderStatus} />
                            </Box>
                        </TabPanel>

                        {/* Products Panel */}
                        <TabPanel px={0} py={6}>
                            <Box bg="white" p={8} borderRadius="2xl" boxShadow="sm">
                                <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th>Product</Th>
                                            <Th>Category</Th>
                                            <Th>Brand</Th>
                                            <Th>Price</Th>
                                            <Th>Actions</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {products.map(product => (
                                            <Tr key={product._id}>
                                                <Td>
                                                    <Flex align="center">
                                                        <Image src={product.images?.[0] || product.img} boxSize="40px" borderRadius="md" mr={3} fallbackSrc="https://via.placeholder.com/40" />
                                                        <Box>
                                                            <Text fontSize="sm" fontWeight="bold">{product.title}</Text>
                                                            <Text fontSize="xs" color="gray.500">{product._id}</Text>
                                                        </Box>
                                                    </Flex>
                                                </Td>
                                                <Td fontSize="sm">{product.category}</Td>
                                                <Td fontSize="sm">{product.brand}</Td>
                                                <Td fontSize="sm" fontWeight="bold">${product.variants?.[0]?.price || product.price}</Td>
                                                <Td>
                                                    <HStack spacing={2}>
                                                        <IconButton size="sm" icon={<FaEdit />} aria-label="Edit" variant="ghost" />
                                                        <IconButton size="sm" icon={<FaTrash />} aria-label="Delete" colorScheme="red" variant="ghost" onClick={() => handleDeleteProduct(product._id)} />
                                                    </HStack>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </Box>
                        </TabPanel>

                        {/* Orders Panel */}
                        <TabPanel px={0} py={6}>
                            <Box bg="white" p={8} borderRadius="2xl" boxShadow="sm">
                                <OrderTable orders={orders} onUpdateStatus={updateOrderStatus} />
                            </Box>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Stack>

            <AddProductModal isOpen={isOpen} onClose={onClose} onSubmit={handleAddProduct} />
        </Box>
    );
}

function AddProductModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        brand: '',
        price: '',
        img: '',
        gender: 'men'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = () => {
        onSubmit({
            ...formData,
            price: Number(formData.price),
            images: [formData.img],
            variants: [{ price: Number(formData.price), size: "9", color: "Black" }]
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add New Product</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Stack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Product Title</FormLabel>
                            <Input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Nike Air Max" />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Category</FormLabel>
                            <Input name="category" value={formData.category} onChange={handleChange} placeholder="e.g. Sneakers" />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Brand</FormLabel>
                            <Input name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. Nike" />
                        </FormControl>
                        <SimpleGrid columns={2} spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Price ($)</FormLabel>
                                <Input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="99.99" />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Gender</FormLabel>
                                <ChakraSelect name="gender" value={formData.gender} onChange={handleChange}>
                                    <option value="men">Men</option>
                                    <option value="women">Women</option>
                                    <option value="kids">Kids</option>
                                </ChakraSelect>
                            </FormControl>
                        </SimpleGrid>
                        <FormControl isRequired>
                            <FormLabel>Image URL</FormLabel>
                            <Input name="img" value={formData.img} onChange={handleChange} placeholder="https://..." />
                        </FormControl>
                    </Stack>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
                    <Button colorScheme="blue" onClick={handleFormSubmit}>Create Product</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

function OrderTable({ orders, onUpdateStatus }) {
    return (
        <Table variant="simple">
            <Thead>
                <Tr>
                    <Th>Order ID</Th>
                    <Th>Customer</Th>
                    <Th>Date</Th>
                    <Th>Amount</Th>
                    <Th>Status</Th>
                    <Th>Action</Th>
                </Tr>
            </Thead>
            <Tbody>
                {orders.map(order => (
                    <Tr key={order._id}>
                        <Td fontSize="sm">#{order._id.substring(order._id.length - 8)}</Td>
                        <Td>
                            <Box>
                                <Text fontSize="sm" fontWeight="medium">{order.shippingAddress.fullName}</Text>
                                <Text fontSize="xs" color="gray.500">{order.userId.substring(0, 8)}...</Text>
                            </Box>
                        </Td>
                        <Td fontSize="sm">{new Date(order.createdAt).toLocaleDateString()}</Td>
                        <Td fontSize="sm" fontWeight="bold">${order.totalAmount}</Td>
                        <Td>
                            <Badge colorScheme={
                                order.status === 'delivered' ? 'green' :
                                    order.status === 'processing' ? 'blue' :
                                        order.status === 'shipped' ? 'purple' :
                                            order.status === 'cancelled' ? 'red' : 'yellow'
                            }>
                                {order.status}
                            </Badge>
                        </Td>
                        <Td>
                            <Menu>
                                <MenuButton as={IconButton} icon={<FaEllipsisV />} size="sm" variant="ghost" />
                                <MenuList>
                                    <MenuItem onClick={() => onUpdateStatus(order._id, 'processing')}>Mark Processing</MenuItem>
                                    <MenuItem onClick={() => onUpdateStatus(order._id, 'shipped')}>Mark Shipped</MenuItem>
                                    <MenuItem onClick={() => onUpdateStatus(order._id, 'delivered')}>Mark Delivered</MenuItem>
                                    <MenuItem onClick={() => onUpdateStatus(order._id, 'cancelled')} color="red.500">Cancel Order</MenuItem>
                                </MenuList>
                            </Menu>
                        </Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
}

function StatCard({ label, value, icon, color }) {
    return (
        <Box bg="white" p={6} borderRadius="2xl" boxShadow="sm" borderLeft="4px solid" borderColor={`${color}.400`}>
            <Flex align="center" justify="space-between">
                <Stat>
                    <StatLabel color="gray.500" fontWeight="bold">{label}</StatLabel>
                    <StatNumber fontSize="2xl" color="#003977">{value}</StatNumber>
                </Stat>
                <Icon as={icon} boxSize={8} color={`${color}.400`} opacity={0.3} />
            </Flex>
        </Box>
    );
}

export default AdminDashboard;
