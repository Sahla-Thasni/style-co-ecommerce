import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import { useAppSelector } from "./redux/hooks";
import { syncCart } from "./services/cartService";

import Home from "./pages/home/Home";
import ProductDetail from "./pages/product/ProductDetail";
import Category from "./pages/category/Category";
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";
import OrderConfirmation from "./pages/order/OrderConfirmation";
import Orders from "./pages/order/Orders";
import OrderDetails from "./pages/order/OrderDetails";
import NewArrivalsPage from "./pages/new-arrivals/NewArrivalsPage";
import Search from "./pages/search/Search";

function App() {
  const { items } = useAppSelector((state) => state.cart);

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const sync = async () => {
      try {
        await syncCart(items);
      } catch (error) {
        console.error("Failed to sync cart:", error);
      }
    };

    sync();
  }, [items, isAuthenticated]);

  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/product/:id" element={<ProductDetail />} />

        <Route path="/category/:category" element={<Category />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/order-confirmation" element={<OrderConfirmation />} />

        <Route path="/orders" element={<Orders />} />

        <Route path="/orders/:id" element={<OrderDetails />} />

        <Route path="/category" element={<Category />} />

        <Route path="/sale" element={<Category />} />

        <Route path="/new-arrivals" element={<NewArrivalsPage />} />

        <Route path="/search" element={<Search />} />
      </Routes>

      <Footer />
    </>
  );
}
export default App;
