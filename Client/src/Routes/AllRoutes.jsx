import { Route, Routes } from "react-router-dom"
import Home from "../Pages/Home"
import NewProduct from "../Pages/NewProducts"
import WomensProducts from "../Pages/WomenProducts"
import MensProducts from "../Pages/MensProducts"
import KidsProducts from "../Pages/KidsProducts"
import Collection from "../Pages/Collection"
import Brands from "../Pages/Brands"
import Sales from "../Pages/Sales"
import Gifts from "../Pages/Gifts"
import ProductDetails from "../Pages/ProductDetails"
import Cart from "../Pages/Cart"
import Checkout from "../Pages/Checkout"
import OrderSuccess from "../Pages/OrderSuccess"
import OrderHistory from "../Pages/OrderHistory"
import AdminDashboard from "../Pages/AdminDashboard";
import TrendingProducts from "../Pages/TrendingProducts";
import ExclusivesProducts from "../Pages/ExclusivesProducts";

function AllRoutes() {
     return (
          <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/new" element={<NewProduct />} />
               <Route path="/womans" element={<WomensProducts />} />
               <Route path="/mens" element={<MensProducts />} />
               <Route path="/kids" element={<KidsProducts />} />
               <Route path="/product/:id" element={<ProductDetails />} />
               <Route path="/cart" element={<Cart />} />
               <Route path="/checkout" element={<Checkout />} />
               <Route path="/order-success" element={<OrderSuccess />} />
               <Route path="/orders" element={<OrderHistory />} />
               <Route path="/trending" element={<TrendingProducts />} />
               <Route path="/exclusives" element={<ExclusivesProducts />} />
               <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
     )
}

export default AllRoutes;
