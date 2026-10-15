import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Card, CardContent, Divider } from "@mui/material";

import { getOrders } from "../../services/orderService";

interface Order {
  id: number;
  status: string;
  subtotal: string;
  discount: string;
  delivery_fee: string;
  total: string;
  created_at: string;
  items: {
    id: number;
    product_name: string;
    price: string;
    quantity: number;
  }[];
}

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading orders...</Typography>
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
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          mb: 4,
        }}
      >
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <Typography color="text.secondary">
          You have no previous orders.
        </Typography>
      ) : (
        orders.map((order) => (
          <Card
            key={order.id}
            onClick={() =>
              navigate(`/orders/${order.id}`, {
                state: {
                  order,
                },
              })
            }
            sx={{
              mb: 3,
              cursor: "pointer",
              transition: "0.2s",
              "&:hover": {
                boxShadow: 4,
              },
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Order
              </Typography>

              <Typography color="text.secondary" sx={{ mb: 2 }}>
                {new Date(order.created_at).toLocaleDateString()}
              </Typography>

              <Divider sx={{ mb: 2 }} />

              {order.items.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography>
                    {item.product_name} × {item.quantity}
                  </Typography>

                  <Typography>
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography>Status</Typography>

                <Typography sx={{ fontWeight: 600 }}>{order.status}</Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 1,
                }}
              >
                <Typography>Total</Typography>

                <Typography sx={{ fontWeight: 600 }}>
                  ${Number(order.total).toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}

export default Orders;
