import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import ProductCard from "./ProductCard";

import { getProducts } from "../services/productService";
import type { Product } from "../types/product";

function NewArrivals() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();

        const sortedProducts = [...data].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );

        setProducts(sortedProducts.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1240px",
        mx: "auto",
        px: {
          xs: "16px",
          lg: "0px",
        },
        pt: {
          xs: "40px",
          lg: "60px",
        },
        pb: "50px",
      }}
    >
      {/* Section heading */}
      <Typography
        sx={{
          textAlign: "center",
          fontFamily: '"Arial Black", Arial, sans-serif',
          fontWeight: 900,
          fontSize: {
            xs: "32px",
            lg: "48px",
          },
          mb: {
            xs: "24px",
            lg: "32px",
          },
        }}
      >
        NEW ARRIVALS
      </Typography>

      {/* Products */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: {
            xs: "20px 12px",
            md: "20px",
          },
        }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Box>

      {/* View All */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: "32px",
        }}
      >
        <Button
          variant="outlined"
          onClick={() => navigate("/new-arrivals")}
          sx={{
            width: "136px",
            height: "40px",
            borderRadius: "22px",
            borderColor: "#E0E0E0",
            color: "#000000",
            textTransform: "none",
          }}
        >
          View All
        </Button>
      </Box>
    </Box>
  );
}

export default NewArrivals;
