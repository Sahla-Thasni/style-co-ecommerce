import { useEffect, useState } from "react"
import { Box, Button, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"
import ProductCard from "./ProductCard"

import { getTopSellingProducts } from "../services/productService"
import type { Product } from "../types/product"


// Top Selling section
function TopSelling() {
  const [products, setProducts] = useState<Product[]>([])
const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
       const data = await getTopSellingProducts()

setProducts(data.slice(0, 4))
      } catch (error) {
        console.error("Failed to fetch products:", error)
      }
    }

    fetchProducts()
  }, [])

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: {
          xs: "100%",
          sm: "776px",
          md: "776px",
          lg: "1240px",
        },
        mx: "auto",
        px: {
          xs: "16px",
          sm: "0px",
          md: "0px",
          lg: "0px",
        },
        pt: {
          xs: "40px",
          sm: "45px",
          md: "50px",
          lg: "60px",
        },
        pb: {
          xs: "40px",
          lg: "50px",
        },
        borderTop: "1px solid #E5E5E5",
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
        TOP SELLING
      </Typography>

      {/* Products */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: {
            xs: "20px 12px",
            md: "20px",
          },
        }}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </Box>

      {/* View All button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: {
            xs: "28px",
            lg: "32px",
          },
        }}
      >
<Button
  variant="outlined"
  onClick={() => navigate("/category?top-selling=true")}
  sx={{
    width: "136px",
    height: "42px",
    borderRadius: "24px",
    borderColor: "#E5E5E5",
    color: "#000000",
    textTransform: "none",
    fontSize: "14px",
    "&:hover": {
      borderColor: "#000000",
      backgroundColor: "transparent",
    },
  }}
>
  View All
</Button>

      </Box>
    </Box>
  )
}

export default TopSelling