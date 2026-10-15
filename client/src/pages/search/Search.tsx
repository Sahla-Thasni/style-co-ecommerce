import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Container, Typography } from "@mui/material";

import ProductCard from "../../components/ProductCard";
import { getProducts } from "../../services/productService";
import type { Product } from "../../types/product";

function Search() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!searchQuery) {
        setProducts([]);
        return;
      }

      try {
        const data = await getProducts(searchQuery);
        setProducts(data);
      } catch (error) {
        console.error("Failed to search products:", error);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: { xs: 4, md: 6 },
      }}
    >
      <Typography
        component="h1"
        sx={{
          fontSize: { xs: 28, md: 36 },
          fontWeight: 700,
          mb: 1,
        }}
      >
        Search Results
      </Typography>

      <Typography
        sx={{
          fontSize: { xs: 14, md: 16 },
          color: "text.secondary",
          mb: { xs: 3, md: 5 },
        }}
      >
        Search for: <strong>{searchQuery}</strong>
      </Typography>

      {products.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(3, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
            gap: {
              xs: 2,
              sm: 3,
              lg: 4,
            },
          }}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            py: 8,
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            No products found
          </Typography>
        </Box>
      )}
    </Container>
  );
}

export default Search;
