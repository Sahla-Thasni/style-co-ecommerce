import { Alert, Box, Snackbar, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getProducts } from "../../services/productService";
import { useEffect, useState } from "react";
import { updateQuantity, removeFromCart } from "../../redux/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import LoginModal from "../../components/auth/LoginModal";
import { calculateCartTotals } from "../../utils/cartUtils";
import { getOrders } from "../../services/orderService";

function Cart() {
  const [products, setProducts] = useState<any[]>([]);
  // Store the promo code entered by the customer
  const [promoCode, setPromoCode] = useState("");
  // Tracks whether a valid promo code has been applied
  const [promoApplied, setPromoApplied] = useState(false);
  // Controls the login modal visibility
  const [loginOpen, setLoginOpen] = useState(false);
  const [isFirstOrder, setIsFirstOrder] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error" as "error" | "success",
  });

  const showSnackbar = (
    message: string,
    severity: "error" | "success" = "error",
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  const guestCartItems = useAppSelector((state) => state.cart.items);

  // Apply the first-order promo code
  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();

    if (code !== "FIRST20") {
      setPromoApplied(false);
      showSnackbar("Invalid promo code");
      return;
    }

    if (!isAuthenticated) {
      setPromoApplied(false);
      setLoginOpen(true);
      return;
    }

    if (!isFirstOrder) {
      setPromoApplied(false);
      showSnackbar("FIRST20 is valid only for your first order.");
      return;
    }

    console.log("FIRST20 ACCEPTED");

    setPromoCode(code);
    setPromoApplied(true);

    showSnackbar("FIRST20 applied successfully!", "success");
  };

  // Match each cart item with its product
  const cartProducts = guestCartItems.map((cartItem) => {
    const product = products.find((product) =>
      product.variants?.some((variant: any) => variant.id === cartItem.variant),
    );

    return {
      ...cartItem,
      product,
    };
  });

  // Check whether the customer is logged in
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const checkFirstOrder = async () => {
      if (!isAuthenticated) {
        setIsFirstOrder(false);
        return;
      }

      try {
        const orders = await getOrders();

        setIsFirstOrder(orders.length === 0);
      } catch (error) {
        console.error("Failed to check order history:", error);
        setIsFirstOrder(false);
      }
    };

    checkFirstOrder();
  }, [isAuthenticated]);

  // Calculate all cart totals using the shared utility
  const { subtotal, productDiscount, firstOrderDiscount, deliveryFee, total } =
    calculateCartTotals(cartProducts, promoApplied);

  // Check authentication before opening checkout
  const handleCheckout = () => {
    if (!isAuthenticated) {
      setLoginOpen(true);
      return;
    }

    navigate("/checkout", {
      state: {
        promoCode: promoApplied ? promoCode : "",
        promoApplied,
      },
    });
  };

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3, md: 8 },
        py: { xs: 3, md: 4 },
      }}
    >
      {/* Cart page heading */}
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: 32, md: 48 },
          fontWeight: 700,
          mb: { xs: 2, md: 3 },
        }}
      >
        YOUR CART
      </Typography>

      {/* Main cart layout */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1.6fr 1fr",
          },
          gap: 2,
        }}
      >
        {/* Cart items section */}
        <Box>
          {/* Cart items container */}
          <Box
            sx={{
              border: "1px solid #E5E5E5",
              borderRadius: 3,
              px: { xs: 2, md: 2.5 },
            }}
          >
            {cartProducts.map((item, index) => {
              // Find the selected variant for this cart item
              const variant = item.product?.variants?.find(
                (variant: any) => variant.id === item.variant,
              );

              return (
                <Box
                  key={item.variant}
                  sx={{
                    display: "flex",
                    gap: 2,
                    py: 2,
                    position: "relative",
                    borderBottom:
                      index !== cartProducts.length - 1
                        ? "1px solid #E5E5E5"
                        : "none",
                  }}
                >
                  {/* Product image */}
                  <Box
                    component="img"
                    src={item.product?.images?.[0]?.image}
                    alt={item.product?.name}
                    sx={{
                      width: { xs: 100, sm: 110, md: 120 },
                      height: { xs: 100, sm: 110, md: 120 },
                      objectFit: "contain",
                      borderRadius: 2,
                      backgroundColor: "#F2F2F2",
                      flexShrink: 0,
                    }}
                  />

                  {/* Product information */}
                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>
                      {item.product?.name}
                    </Typography>

                    <Typography variant="body2">
                      Size: {variant?.size}
                    </Typography>

                    <Typography variant="body2">
                      Color: {variant?.color}
                    </Typography>

                    {/* Price and quantity */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mt: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: { xs: 20, md: 24 },
                          fontWeight: 600,
                        }}
                      >
                        $
                        {item.product?.discount_price ??
                          item.product?.unit_price}
                      </Typography>
                      {/* Quantity control */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: { xs: 1.5, md: 2 },
                          backgroundColor: "#F2F2F2",
                          borderRadius: 5,
                          px: { xs: 1.5, md: 2 },
                          py: 1,
                        }}
                      >
                        <Typography
                          sx={{ cursor: "pointer" }}
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                variant: item.variant,
                                quantity: Math.max(1, item.quantity - 1),
                              }),
                            )
                          }
                        >
                          −
                        </Typography>

                        <Typography>{item.quantity}</Typography>

                        <Typography
                          sx={{ cursor: "pointer" }}
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                variant: item.variant,
                                quantity: item.quantity + 1,
                              }),
                            )
                          }
                        >
                          +
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Remove item button */}
                  <DeleteIcon
                    sx={{
                      color: "error.main",
                      cursor: "pointer",
                      position: "absolute",
                      top: 18,
                      right: 0,
                    }}
                    onClick={() => dispatch(removeFromCart(item.variant))}
                  />
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Order summary section */}
        <Box
          sx={{
            border: "1px solid #E5E5E5",
            borderRadius: 3,
            p: { xs: 2, md: 3 },
            height: "fit-content",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 20, md: 24 },
              fontWeight: 600,
              mb: 3,
            }}
          >
            Order Summary
          </Typography>

          <Box>
            {/* Subtotal */}
            <Typography
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <span>Subtotal</span>
              <strong>${Number(subtotal).toFixed(2)}</strong>
            </Typography>

            {/* Product Discount */}
            {productDiscount > 0 && (
              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <span>Product Discount</span>
                <strong>-${Number(productDiscount).toFixed(2)}</strong>
              </Typography>
            )}

            {/* FIRST20 Discount */}
            {promoApplied && firstOrderDiscount > 0 && (
              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                  color: "error.main",
                }}
              >
                <span>FIRST20 (-20%)</span>
                <strong>-${Number(firstOrderDiscount).toFixed(2)}</strong>
              </Typography>
            )}

            {/* Delivery Fee */}
            <Typography
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <span>Delivery Fee</span>
              <strong>${Number(deliveryFee).toFixed(2)}</strong>
            </Typography>

            {/* Total */}
            <Box
              sx={{
                borderTop: "1px solid #E5E5E5",
                pt: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontWeight: 500 }}>Total</Typography>

              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                ${Number(total).toFixed(2)}
              </Typography>
            </Box>

            {/* First Order Offer */}
            {!promoApplied && (
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  backgroundColor: "#F2F0F1",
                  borderRadius: 2,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  🎉 First Order Offer
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.5,
                  }}
                >
                  Get 20% off on your first order.
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    fontWeight: 600,
                  }}
                >
                  Use code: FIRST20
                </Typography>
              </Box>
            )}

            {/* Applied Promo Message */}
            {promoApplied && promoCode === "FIRST20" && (
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  backgroundColor: "#F2F0F1",
                  borderRadius: 2,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: "success.main",
                  }}
                >
                  🎉 FIRST20 applied
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.5,
                  }}
                >
                  20% off your first order has been applied.
                </Typography>
              </Box>
            )}

            {/* Promo Code Input */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: 3,
                alignItems: "center",
              }}
            >
              <Box
                component="input"
                value={promoCode}
                onChange={(event) => setPromoCode(event.target.value)}
                placeholder="Add promo code"
                sx={{
                  flex: 1,
                  minWidth: 0,
                  px: 2,
                  py: 1.5,
                  border: "none",
                  borderRadius: 5,
                  backgroundColor: "#F2F2F2",
                  fontSize: 14,
                  outline: "none",
                }}
              />

              <button
                type="button"
                onClick={handleApplyPromo}
                style={{
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "24px",
                  backgroundColor: "#000",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Apply
              </button>
            </Box>

            {/* Go to Checkout */}
            <Box
              component="button"
              onClick={handleCheckout}
              sx={{
                width: "100%",
                mt: 3,
                py: { xs: 1.5, md: 1.7 },
                border: "none",
                borderRadius: 5,
                backgroundColor: "#000",
                color: "#fff",
                fontSize: { xs: 14, md: 16 },
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Go to Checkout →
            </Box>
          </Box>
        </Box>
      </Box>
      {/* Login modal for guest checkout */}
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onRegister={() => {
          setLoginOpen(false);
        }}
        onLoginSuccess={() => {
          navigate("/checkout", {
            state: {
              promoCode: promoApplied ? promoCode : "",
              promoApplied,
            },
          });
        }}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar({
            ...snackbar,
            open: false,
          })
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={() =>
            setSnackbar({
              ...snackbar,
              open: false,
            })
          }
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Cart;
