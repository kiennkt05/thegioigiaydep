import { createContext, useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@chakra-ui/react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [] });
    const [userId, setUserId] = useState(null);
    const toast = useToast();

    // Initialize User ID (Guest persistence)
    useEffect(() => {
        let storedUserId = localStorage.getItem("cart_user_id");
        if (!storedUserId) {
            storedUserId = uuidv4();
            localStorage.setItem("cart_user_id", storedUserId);
        }
        setUserId(storedUserId);
    }, []);

    // Fetch Cart when userId is available
    useEffect(() => {
        if (userId) {
            fetchCart();
        }
    }, [userId]);

    const fetchCart = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/cart/${userId}`);
            const data = await res.json();
            setCart(data);
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        }
    };

    const addToCart = async (product, variant, quantity = 1) => {
        try {
            const res = await fetch("http://localhost:3000/api/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    product,
                    variant,
                    quantity
                }),
            });
            const updatedCart = await res.json();
            setCart(updatedCart);

            toast({
                title: "Added to Bag",
                description: `${product.title} (Size: ${variant.size}) has been added.`,
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        } catch (error) {
            console.error("Failed to add to cart:", error);
            toast({
                title: "Error",
                description: "Could not add item to cart.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        }
    };

    const updateQuantity = async (productId, size, quantity) => {
        try {
            const res = await fetch("http://localhost:3000/api/cart/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, productId, size, quantity }),
            });
            const updatedCart = await res.json();
            setCart(updatedCart);
        } catch (error) {
            console.error("Failed to update quantity:", error);
        }
    };

    const removeFromCart = async (productId, size) => {
        try {
            const res = await fetch("http://localhost:3000/api/cart/remove", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, productId, size }),
            });
            const updatedCart = await res.json();
            setCart(updatedCart);

            toast({
                title: "Item Removed",
                status: "info",
                duration: 2000,
                isClosable: true,
                position: "top",
            });
        } catch (error) {
            console.error("Failed to remove item:", error);
        }
    };

    const transitionUser = async (authUserId) => {
        const guestUserId = localStorage.getItem("cart_user_id");
        if (guestUserId && authUserId && guestUserId !== authUserId) {
            try {
                const res = await fetch("http://localhost:3000/api/cart/transition", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ guestUserId, authUserId }),
                });
                const updatedCart = await res.json();
                setCart(updatedCart);
                setUserId(authUserId);
                // We keep cart_user_id in local storage for generic cart fetching, 
                // but we should probably clear it or update it to the auth user ID.
                localStorage.setItem("cart_user_id", authUserId);
            } catch (error) {
                console.error("Failed to transition cart:", error);
                setUserId(authUserId);
            }
        } else if (authUserId) {
            setUserId(authUserId);
        }
    };

    const cartCount = cart.items ? cart.items.reduce((acc, item) => acc + item.quantity, 0) : 0;
    const cartTotal = cart.items ? cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0) : 0;

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, cartCount, cartTotal, userId, fetchCart, transitionUser }}>
            {children}
        </CartContext.Provider>
    );
};
