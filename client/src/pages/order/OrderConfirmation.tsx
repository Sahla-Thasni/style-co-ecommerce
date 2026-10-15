import { Box, Button, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();

  const order = location.state?.order;
  if (!order) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography>Order details are not available.</Typography>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 6,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 500,
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: 60,
            mb: 2,
          }}
        >
          ✓
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            mb: 1,
          }}
        >
          Order Confirmed!
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Thank you for your order.
        </Typography>

        <Typography sx={{ mb: 1 }}>Order</Typography>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 4,
          }}
        >
          Total: ${Number(order?.total ?? 0).toFixed(2)}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
          }}
        >
          <Button variant="contained" onClick={() => navigate("/orders")}>
            View My Orders
          </Button>

          <Button variant="outlined" onClick={() => navigate("/")}>
            Continue Shopping
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default OrderConfirmation;
