import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import { Alert, Box, Snackbar, TextField, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { calculateCartTotals } from "../../utils/cartUtils";
import { createOrder } from "../../services/orderService";
import { clearCart } from "../../redux/cart/cartSlice";
import { useLocation, useNavigate } from "react-router-dom";

function Checkout() {
  const [products, setProducts] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error" as "error" | "success",
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const location = useLocation();

  const promoCode = location.state?.promoCode || "";
  const promoApplied = location.state?.promoApplied || false;

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

  // Store the customer's delivery address
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    emirate: "",
    postalCode: "",
  });

  // Get the customer's current cart
  const cartItems = useAppSelector((state) => state.cart.items);

  // Match each cart item with its product information
  const checkoutProducts = cartItems.map((cartItem) => {
    const product = products.find((product) =>
      product.variants?.some((variant: any) => variant.id === cartItem.variant),
    );

    return {
      ...cartItem,
      product,
    };
  });

  // Calculate checkout totals using the same cart calculation logic
  const { subtotal, discount, deliveryFee, total } = calculateCartTotals(
    checkoutProducts,
    promoApplied,
  );
  // Validate checkout details and create the order
  const handlePlaceOrder = async () => {
    if (isSubmitting) {
      return;
    }

    if (!address.fullName.trim()) {
      showSnackbar("Please enter your full name");
      return;
    }

    if (!address.phone.trim()) {
      showSnackbar("Please enter your phone number");
      return;
    }

    if (!address.address.trim()) {
      showSnackbar("Please enter your address");
      return;
    }

    if (!address.city.trim()) {
      showSnackbar("Please enter your city");
      return;
    }

    if (!address.emirate.trim()) {
      showSnackbar("Please enter your emirate");
      return;
    }

    if (!paymentMethod) {
      showSnackbar("Please select a payment method");
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await createOrder({
        full_name: address.fullName,
        phone: address.phone,
        address: address.address,
        city: address.city,
        emirate: address.emirate,
        postal_code: address.postalCode,
        payment_method: paymentMethod,
        promo_code: promoApplied ? promoCode : "",
      });

      dispatch(clearCart());

      navigate("/order-confirmation", {
        state: {
          order,
        },
      });
    } catch (error) {
      console.error("Failed to create order:", error);
      showSnackbar("Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3, md: 8 },
        py: { xs: 3, md: 4 },
      }}
    >
      {/* Checkout page heading */}
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: 32, md: 48 },
          fontWeight: 700,
          mb: 3,
        }}
      >
        CHECKOUT
      </Typography>

      {/* Main checkout layout */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1.6fr 1fr",
          },
          gap: 3,
        }}
      >
        {/* Customer information */}
        <Box>
          {/* Delivery address section */}
          <Box
            sx={{
              border: "1px solid #E5E5E5",
              borderRadius: 3,
              p: { xs: 2, md: 3 },
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: 20, md: 24 },
                fontWeight: 600,
                mb: 3,
              }}
            >
              Delivery Address
            </Typography>

            <Box>
              <TextField
                fullWidth
                label="Full Name"
                margin="normal"
                value={address.fullName}
                onChange={(event) =>
                  setAddress({
                    ...address,
                    fullName: event.target.value,
                  })
                }
              />

              <TextField
                fullWidth
                label="Phone Number"
                margin="normal"
                value={address.phone}
                onChange={(event) =>
                  setAddress({
                    ...address,
                    phone: event.target.value,
                  })
                }
              />

              <TextField
                fullWidth
                label="Address"
                margin="normal"
                value={address.address}
                onChange={(event) =>
                  setAddress({
                    ...address,
                    address: event.target.value,
                  })
                }
              />

              <TextField
                fullWidth
                label="City"
                margin="normal"
                value={address.city}
                onChange={(event) =>
                  setAddress({
                    ...address,
                    city: event.target.value,
                  })
                }
              />

              <TextField
                fullWidth
                label="Emirate"
                margin="normal"
                value={address.emirate}
                onChange={(event) =>
                  setAddress({
                    ...address,
                    emirate: event.target.value,
                  })
                }
              />

              <TextField
                fullWidth
                label="Postal Code"
                margin="normal"
                value={address.postalCode}
                onChange={(event) =>
                  setAddress({
                    ...address,
                    postalCode: event.target.value,
                  })
                }
              />
            </Box>
          </Box>

          {/* Payment method section */}
          <Box
            sx={{
              border: "1px solid #E5E5E5",
              borderRadius: 3,
              p: { xs: 2, md: 3 },
              mt: 3,
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: 20, md: 24 },
                fontWeight: 600,
                mb: 3,
              }}
            >
              Payment Method
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                border: "1px solid #E5E5E5",
                borderRadius: 2,
                cursor: "pointer",
              }}
              onClick={() => setPaymentMethod("cod")}
            >
              <input
                type="radio"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />

              <Box>
                <Typography sx={{ fontWeight: 600 }}>
                  Cash on Delivery
                </Typography>

                <Typography variant="body2">
                  Pay when your order is delivered.
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                mt: 2,
                border: "1px solid #E5E5E5",
                borderRadius: 2,
                cursor: "pointer",
              }}
              onClick={() => setPaymentMethod("card")}
            >
              <input
                type="radio"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />

              <Box>
                <Typography sx={{ fontWeight: 600 }}>
                  Credit / Debit Card
                </Typography>

                <Typography variant="body2">Pay securely by card.</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box>
          {/* Order summary */}
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

            <Typography
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography>Discount</Typography>

              <Typography>-${discount.toFixed(2)}</Typography>
            </Box>

            {promoApplied && promoCode && (
              <Typography
                sx={{
                  fontSize: 13,
                  color: "success.main",
                  mb: 2,
                }}
              >
                Promo code applied: <strong>{promoCode}</strong>
              </Typography>
            )}
            <Typography
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <span>Delivery Fee</span>
              <strong>${deliveryFee.toFixed(2)}</strong>
            </Typography>

            <Box
              sx={{
                borderTop: "1px solid #E5E5E5",
                pt: 2,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography sx={{ fontWeight: 500 }}>Total</Typography>

              <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
                ${total.toFixed(2)}
              </Typography>
            </Box>
            {/* Place order button */}
            <Box
              component="button"
              disabled={isSubmitting}
              onClick={handlePlaceOrder}
              sx={{
                width: "100%",
                mt: 3,
                py: 1.5,
                border: "none",
                borderRadius: 5,
                backgroundColor: "#000",
                color: "#fff",
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Place Order
            </Box>
          </Box>
        </Box>
      </Box>

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
          sx={{
            width: "100%",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Checkout;
