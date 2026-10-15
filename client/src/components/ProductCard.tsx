import { Box, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import type { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const location = useLocation();

  console.log("Product image:", product.images[0]?.image);
  const hasDiscount = Number(product.discount_percentage) > 0;

  return (
    <Box
      onClick={() =>
        navigate(`/product/${product.id}`, {
          state: {
            from: location.pathname,
            search: location.search,
          },
        })
      }
      sx={{
        cursor: "pointer",
      }}
    >
      {/* Product image */}
      <Box
        sx={{
          width: "100%",
          height: {
            xs: "200px",
            sm: "220px",
            md: "260px",
            lg: "300px",
          },
          backgroundColor: "#F0EEED",
          borderRadius: "14px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          component="img"
          src={
            product.images.find((image) => image.view === "front")?.image ||
            product.images[0]?.image
          }
          alt={product.name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </Box>

      {/* Product name */}
      <Typography
        sx={{
          mt: "10px",
          fontSize: {
            xs: "13px",
            lg: "16px",
          },
          lineHeight: "20px",
          fontWeight: 600,
        }}
      >
        {product.name}
      </Typography>

      {/* Product rating */}
      {product.review_count > 0 ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            mt: "4px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
            }}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <Typography
                key={star}
                sx={{
                  color:
                    star <= Math.floor(product.average_rating)
                      ? "#FFB800"
                      : "#D9D9D9",
                  fontSize: "14px",
                }}
              >
                ★
              </Typography>
            ))}
          </Box>

          <Typography
            sx={{
              fontSize: "12px",
              color: "#000000",
            }}
          >
            {product.average_rating}/5
          </Typography>
        </Box>
      ) : (
        <Typography
          sx={{
            fontSize: "12px",
            color: "#999999",
            mt: "4px",
          }}
        >
          No reviews
        </Typography>
      )}

      {/* Product price */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          mt: "4px",
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: "18px",
              lg: "22px",
            },
            fontWeight: 600,
          }}
        >
          ${product.discount_price}
        </Typography>

        {hasDiscount && (
          <>
            <Typography
              sx={{
                fontSize: {
                  xs: "16px",
                  lg: "20px",
                },
                color: "#999999",
                textDecoration: "line-through",
              }}
            >
              ${product.unit_price}
            </Typography>

            <Box
              sx={{
                backgroundColor: "#FFE5E5",
                borderRadius: "20px",
                px: "8px",
                py: "3px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "10px",
                  color: "#FF3333",
                }}
              >
                -{product.discount_percentage}%
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

export default ProductCard;
