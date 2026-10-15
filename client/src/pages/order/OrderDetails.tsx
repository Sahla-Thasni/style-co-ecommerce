import { Box, Button, Divider, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

function OrderDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Order details are not available.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3, md: 8 },
        py: { xs: 3, md: 5 },
      }}
    >
      <Button variant="text" onClick={() => navigate("/orders")} sx={{ mb: 2 }}>
        ← Back to Orders
      </Button>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          mb: 1,
        }}
      >
        Order
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 4 }}>
        {new Date(order.created_at).toLocaleDateString()}
      </Typography>

      <Box
        sx={{
          maxWidth: 900,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          p: { xs: 2, md: 4 },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 2,
          }}
        >
          Items
        </Typography>

        {order.items.map((item: any) => (
          <Box key={item.id}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                py: 2,
              }}
            >
              <Typography>
                {item.product_name} × {item.quantity}
              </Typography>

              <Typography sx={{ fontWeight: 600 }}>
                ${(Number(item.price) * item.quantity).toFixed(2)}
              </Typography>
            </Box>

            <Divider />
          </Box>
        ))}

        <Box sx={{ mt: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography>Subtotal</Typography>
            <Typography>${Number(order.subtotal).toFixed(2)}</Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography>Discount</Typography>
            <Typography>-${Number(order.discount).toFixed(2)}</Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography>Delivery Fee</Typography>
            <Typography>${Number(order.delivery_fee).toFixed(2)}</Typography>
          </Box>

          <Divider />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
              }}
            >
              Total
            </Typography>

            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 20,
              }}
            >
              ${Number(order.total).toFixed(2)}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <Typography>Status</Typography>

            <Typography sx={{ fontWeight: 600 }}>{order.status}</Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          mt: 4,
          p: 4,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          backgroundColor: "background.paper",
          maxWidth: 900,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Delivery Information
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
            },
            columnGap: 6,
            rowGap: 2.5,
          }}
        >
          {/* Full Name */}
          <Box>
            <Typography variant="body2" color="text.secondary">
              Full Name
            </Typography>
            <Typography sx={{ fontWeight: 500, mt: 0.5 }}>
              {order.full_name}
            </Typography>
          </Box>

          {/* Phone */}
          <Box>
            <Typography variant="body2" color="text.secondary">
              Phone
            </Typography>
            <Typography sx={{ fontWeight: 500, mt: 0.5 }}>
              {order.phone}
            </Typography>
          </Box>

          {/* Address */}
          <Box sx={{ gridColumn: { sm: "1 / -1" } }}>
            <Typography variant="body2" color="text.secondary">
              Address
            </Typography>
            <Typography sx={{ fontWeight: 500, mt: 0.5 }}>
              {order.address}
            </Typography>
          </Box>

          {/* City */}
          <Box>
            <Typography variant="body2" color="text.secondary">
              City
            </Typography>
            <Typography sx={{ fontWeight: 500, mt: 0.5 }}>
              {order.city}
            </Typography>
          </Box>

          {/* Emirate */}
          <Box>
            <Typography variant="body2" color="text.secondary">
              Emirate
            </Typography>
            <Typography sx={{ fontWeight: 500, mt: 0.5 }}>
              {order.emirate}
            </Typography>
          </Box>

          {/* Postal Code */}
          <Box>
            <Typography variant="body2" color="text.secondary">
              Postal Code
            </Typography>
            <Typography sx={{ fontWeight: 500, mt: 0.5 }}>
              {order.postal_code}
            </Typography>
          </Box>
        </Box>

        {/* Payment Method */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Payment Method
          </Typography>

          <Typography sx={{ fontWeight: 500, mt: 0.5 }}>
            {order.payment_method === "cod"
              ? "Cash on Delivery"
              : "Credit / Debit Card"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default OrderDetails;
