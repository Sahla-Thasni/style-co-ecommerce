import { useEffect, useState } from "react";
import { useAppDispatch } from "../../redux/hooks";

import {
  Add,
  Remove,
  Star,
  Tune,
  KeyboardArrowDown,
  MoreHoriz,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";

import api from "../../services/api";
import type { Product } from "../../types/product";
import ProductCard from "../../components/ProductCard";
import { getProducts } from "../../services/productService";
import { addToCart } from "../../redux/cart/cartSlice";
import { useLocation } from "react-router-dom";
import {
  getProductReviews,
  getReviewEligibility,
  createProductReview,
} from "../../services/reviewService";

import type { Review } from "../../types/review";

// Product detail page
function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();
  const search = location.state?.search || "";

  const dispatch = useAppDispatch();

  const faqs = [
    {
      question: "What material is this t-shirt made of?",
      answer: "This t-shirt is made from soft and comfortable cotton fabric.",
    },
    {
      question: "How should I wash this t-shirt?",
      answer:
        "We recommend machine washing with similar colors and following the care instructions on the product.",
    },
    {
      question: "Can I return this product?",
      answer:
        "Yes. You can return the product according to the store's return policy.",
    },
  ];

  const [product, setProduct] = useState<Product | null>(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [activeTab, setActiveTab] = useState("reviews");

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const [reviews, setReviews] = useState<Review[]>([]);

  const [canReview, setCanReview] = useState(false);

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const showSnackbar = (
    message: string,
    severity: "success" | "error" = "success",
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}/`);

        setProduct(response.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const products = await getProducts();

        const related = products
          .filter((item) => item.id !== Number(id))
          .slice(0, 4);

        setRelatedProducts(related);
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      }
    };

    fetchRelatedProducts();
  }, [id]);

  // Set first product color
  useEffect(() => {
    if (product && product.variants.length > 0) {
      const firstColor = product.variants[0].color;

      setSelectedColor(firstColor);
    }
  }, [product]);

  // Load product reviews
  useEffect(() => {
    const loadReviews = async () => {
      if (!product?.id) {
        return;
      }

      try {
        const data = await getProductReviews(product.id);

        setReviews(data);
      } catch (error) {
        console.error("Failed to load reviews:", error);
      }
    };

    loadReviews();
  }, [product?.id]);

  // Check review eligibility
  useEffect(() => {
    const checkReviewEligibility = async () => {
      if (!product?.id) {
        return;
      }

      try {
        const data = await getReviewEligibility(product.id);

        setCanReview(data.can_review);
      } catch {
        setCanReview(false);
      }
    };

    checkReviewEligibility();
  }, [product?.id]);

  // Submit review
  const handleSubmitReview = async () => {
    if (!reviewRating || !reviewComment.trim()) {
      return;
    }

    if (!product?.id) {
      return;
    }

    try {
      setIsSubmittingReview(true);

      await createProductReview(product.id, reviewRating, reviewComment.trim());

      const updatedReviews = await getProductReviews(product.id);

      setReviews(updatedReviews);

      setCanReview(false);

      setReviewRating(0);
      setReviewComment("");
      setIsReviewFormOpen(false);
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) /
        reviews.length
      : 0;

  if (!product) {
    return (
      <Box
        sx={{
          width: "100%",
          py: 6,
          textAlign: "center",
        }}
      >
        <Typography color="text.secondary">Loading product...</Typography>
      </Box>
    );
  }

  const colors = [...new Set(product.variants.map((variant) => variant.color))];

  const filteredImages = product.images
    .filter((image) => image.color === selectedColor)
    .sort((a, b) => {
      if (a.view === "front" && b.view === "back") return -1;
      if (a.view === "back" && b.view === "front") return 1;
      return 0;
    });

  const sizes = [...new Set(product.variants.map((variant) => variant.size))];

  const selectedVariant = product.variants.find(
    (variant) =>
      variant.color === selectedColor && variant.size === selectedSize,
  );

  const handleAddToCart = () => {
    if (!selectedColor && !selectedSize) {
      showSnackbar("Please select a color and size", "error");
      return;
    }

    if (!selectedColor) {
      showSnackbar("Please select a color", "error");
      return;
    }

    if (!selectedSize) {
      showSnackbar("Please select a size", "error");
      return;
    }

    dispatch(
      addToCart({
        variant: selectedVariant!.id,
        quantity,
      }),
    );

    showSnackbar("Product added to cart successfully", "success");
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <Box
      sx={{
        width: {
          xs: "calc(100% - 32px)",
          sm: "calc(100% - 40px)",
          md: "calc(100% - 48px)",
          lg: "calc(100% - 116px)",
        },
        maxWidth: "1240px",
        mx: "auto",
      }}
    >
      {/* Breadcrumb */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
          py: {
            xs: "14px",
            sm: "16px",
            lg: "18px",
          },
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: "12px" }}
        >
          Home
        </Typography>

        {search.includes("style=") ? (
          <>
            <Typography color="text.secondary">›</Typography>

            <Typography
              variant="body2"
              color="text.primary"
              sx={{ fontSize: "12px" }}
            >
              {new URLSearchParams(search).get("style")}
            </Typography>
          </>
        ) : search.includes("brand=") ? (
          <>
            <Typography color="text.secondary">›</Typography>

            <Typography
              variant="body2"
              color="text.primary"
              sx={{ fontSize: "12px" }}
            >
              Brands
            </Typography>

            <Typography color="text.secondary">›</Typography>

            <Typography
              variant="body2"
              color="text.primary"
              sx={{ fontSize: "12px" }}
            >
              {product.brand?.name}
            </Typography>
          </>
        ) : (
          <>
            <Typography color="text.secondary">›</Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "12px" }}
            >
              Shop
            </Typography>

            <Typography color="text.secondary">›</Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: "12px" }}
            >
              {product.gender === "women" ? "Women" : "Men"}
            </Typography>

            <Typography color="text.secondary">›</Typography>

            <Typography
              variant="body2"
              color="text.primary"
              sx={{ fontSize: "12px" }}
            >
              {product.category.name}
            </Typography>
          </>
        )}
      </Box>
      {/* Main product section */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1fr 1fr",
          },
          gap: {
            xs: "24px",
            sm: "28px",
            md: "32px",
            lg: "28px",
          },
        }}
      >
        {/* Product gallery */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "80px minmax(0, 1fr)",
              md: "90px minmax(0, 1fr)",
            },
            gap: {
              xs: "10px",
              sm: "10px",
              md: "10px",
            },
          }}
        >
          {/* Main image */}
          <Box
            sx={{
              gridColumn: {
                xs: "1",
                sm: "2",
              },
              gridRow: {
                xs: "1",
                sm: "1",
              },
              order: {
                xs: 1,
                sm: 2,
              },
              width: "100%",
              height: {
                xs: "300px",
                sm: "330px",
                md: "350px",
                lg: "350px",
              },
              backgroundColor: "grey.100",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {filteredImages[selectedImage] && (
              <Box
                component="img"
                src={filteredImages[selectedImage].image}
                alt={product.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            )}
          </Box>

          {/* Thumbnails */}
          <Box
            sx={{
              gridColumn: {
                xs: "1",
                sm: "1",
              },
              gridRow: {
                xs: "2",
                sm: "1",
              },
              order: {
                xs: 2,
                sm: 1,
              },
              display: "flex",
              flexDirection: {
                xs: "row",
                sm: "column",
              },
              gap: "10px",
              overflow: "hidden",
            }}
          >
            {filteredImages.map((image, index) => (
              <Box
                key={image.id}
                onClick={() => setSelectedImage(index)}
                sx={{
                  flexShrink: 0,
                  width: {
                    xs: "76px",
                    sm: "80px",
                    md: "90px",
                  },
                  height: {
                    xs: "76px",
                    sm: "80px",
                    md: "90px",
                  },
                  backgroundColor: "grey.100",
                  borderRadius: 2,
                  overflow: "hidden",
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor:
                    selectedImage === index ? "text.primary" : "transparent",
                }}
              >
                <Box
                  component="img"
                  src={image.image}
                  alt={`${product.name} ${index + 1}`}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Product information */}
        <Box
          sx={{
            minWidth: 0,
          }}
        >
          {/* Product name */}
          <Typography
            component="h1"
            sx={{
              fontFamily: '"Arial Black", Arial, sans-serif',
              fontWeight: 900,
              fontSize: {
                xs: "28px",
                sm: "32px",
                md: "36px",
                lg: "32px",
              },
              lineHeight: {
                xs: "32px",
                sm: "36px",
                lg: "36px",
              },
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
                mt: 1,
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
                      fontSize: "16px",
                    }}
                  >
                    ★
                  </Typography>
                ))}
              </Box>

              <Typography
                sx={{
                  fontSize: "13px",
                  color: "#000000",
                }}
              >
                {product.average_rating}/5
              </Typography>
            </Box>
          ) : (
            <Typography
              sx={{
                fontSize: "13px",
                color: "#999999",
                mt: 1,
              }}
            >
              No reviews
            </Typography>
          )}

          {/* Price */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
              mt: "8px",
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "26px",
                  sm: "28px",
                },
                fontWeight: 600,
              }}
            >
              ${product.discount_price}
            </Typography>

            {Number(product.discount_percentage) > 0 && (
              <>
                <Typography
                  sx={{
                    fontSize: {
                      xs: "21px",
                      sm: "23px",
                    },
                    color: "text.secondary",
                    textDecoration: "line-through",
                  }}
                >
                  ${product.unit_price}
                </Typography>

                <Box
                  sx={{
                    backgroundColor: "#FFE5E5",
                    borderRadius: 3,
                    px: "10px",
                    py: "4px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "11px",
                      color: "#FF3333",
                    }}
                  >
                    -{product.discount_percentage}%
                  </Typography>
                </Box>
              </>
            )}
          </Box>

          {/* Description */}
          <Typography
            sx={{
              mt: "10px",
              pb: "16px",
              borderBottom: "1px solid",
              borderColor: "divider",
              fontSize: "12px",
              lineHeight: "18px",
              color: "text.secondary",
            }}
          >
            {product.description}
          </Typography>

          {/* Colors */}
          <Box
            sx={{
              py: "14px",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              sx={{
                fontSize: "12px",
                color: "text.secondary",
                mb: "10px",
              }}
            >
              Select Colors
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: "10px",
              }}
            >
              {colors.map((color) => (
                <Box
                  key={color}
                  onClick={() => {
                    setSelectedColor(color);
                    setSelectedImage(0);
                  }}
                  sx={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: color,
                    border: "2px solid",
                    borderColor:
                      selectedColor === color ? "text.primary" : "transparent",
                    outline:
                      selectedColor === color ? "1px solid white" : "none",
                    cursor: "pointer",
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Sizes */}
          <Box
            sx={{
              py: "14px",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              sx={{
                fontSize: "12px",
                color: "text.secondary",
                mb: "10px",
              }}
            >
              Choose Size
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {sizes.map((size) => (
                <Button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  sx={{
                    minWidth: "55px",
                    height: "30px",
                    px: "14px",
                    borderRadius: 3,
                    backgroundColor:
                      selectedSize === size ? "primary.main" : "grey.100",
                    color:
                      selectedSize === size
                        ? "primary.contrastText"
                        : "text.secondary",
                    fontSize: "10px",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor:
                        selectedSize === size ? "primary.main" : "grey.200",
                    },
                  }}
                >
                  {size}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Quantity and Add to Cart */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              mt: "14px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "105px",
                height: "42px",
                backgroundColor: "grey.100",
                borderRadius: 3,
                px: "4px",
              }}
            >
              <IconButton onClick={decreaseQuantity} size="small">
                <Remove
                  sx={{
                    fontSize: "17px",
                  }}
                />
              </IconButton>

              <Typography
                sx={{
                  fontSize: "13px",
                }}
              >
                {quantity}
              </Typography>

              <IconButton onClick={increaseQuantity} size="small">
                <Add
                  sx={{
                    fontSize: "17px",
                  }}
                />
              </IconButton>
            </Box>

            <Button
              onClick={handleAddToCart}
              sx={{
                flex: 1,
                height: "42px",
                borderRadius: 3,
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                textTransform: "none",
                fontSize: "12px",
                "&:hover": {
                  backgroundColor: "primary.main",
                },
              }}
            >
              Add to Cart
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Product tabs */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          mt: {
            xs: "40px",
            sm: "44px",
            md: "46px",
            lg: "48px",
          },
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          onClick={() => handleTabChange("details")}
          sx={{
            py: "14px",
            textAlign: "center",
            cursor: "pointer",
            borderBottom: activeTab === "details" ? "2px solid" : "none",
            borderColor: "text.primary",
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "11px",
                sm: "12px",
              },
              color:
                activeTab === "details" ? "text.primary" : "text.secondary",
              fontWeight: activeTab === "details" ? 500 : 400,
            }}
          >
            Product Details
          </Typography>
        </Box>

        <Box
          onClick={() => handleTabChange("reviews")}
          sx={{
            py: "14px",
            textAlign: "center",
            cursor: "pointer",
            borderBottom: activeTab === "reviews" ? "2px solid" : "none",
            borderColor: "text.primary",
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "11px",
                sm: "12px",
              },
              color:
                activeTab === "reviews" ? "text.primary" : "text.secondary",
              fontWeight: activeTab === "reviews" ? 500 : 400,
            }}
          >
            Rating & Reviews
          </Typography>
        </Box>

        <Box
          onClick={() => handleTabChange("faqs")}
          sx={{
            py: "14px",
            textAlign: "center",
            cursor: "pointer",
            borderBottom: activeTab === "faqs" ? "2px solid" : "none",
            borderColor: "text.primary",
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "11px",
                sm: "12px",
              },
              color: activeTab === "faqs" ? "text.primary" : "text.secondary",
              fontWeight: activeTab === "faqs" ? 500 : 400,
            }}
          >
            FAQs
          </Typography>
        </Box>
      </Box>
      {activeTab === "details" && (
        <Box sx={{ py: "30px" }}>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 600,
              mb: "12px",
            }}
          >
            Product Details
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
              lineHeight: 1.7,
            }}
          >
            {product.description}
          </Typography>
        </Box>
      )}

      {activeTab === "reviews" && (
        <Box sx={{ py: "30px" }}>
          {/* Reviews header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: {
                xs: "20px",
                md: "24px",
              },
              gap: "12px",
            }}
          >
            {/* Review count */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Typography
                sx={{
                  fontSize: {
                    xs: "16px",
                    sm: "18px",
                  },
                  fontWeight: 600,
                }}
              >
                All Reviews
              </Typography>

              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "24px",
                }}
              >
                {averageRating.toFixed(1)}
              </Typography>

              <Typography
                sx={{
                  fontSize: {
                    xs: "11px",
                    sm: "12px",
                  },
                  color: "text.secondary",
                }}
              >
                ({reviews.length})
              </Typography>
            </Box>

            {/* Review actions */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: {
                  xs: "6px",
                  sm: "8px",
                },
              }}
            >
              {/* Filter */}
              <IconButton
                size="small"
                aria-label="Filter reviews"
                sx={{
                  width: "32px",
                  height: "32px",
                  backgroundColor: "grey.100",
                }}
              >
                <Tune sx={{ fontSize: "17px" }} />
              </IconButton>

              {/* Latest */}
              <Button
                endIcon={
                  <KeyboardArrowDown
                    sx={{
                      fontSize: "16px !important",
                    }}
                  />
                }
                sx={{
                  minWidth: "76px",
                  height: "32px",
                  px: "12px",
                  borderRadius: 3,
                  backgroundColor: "grey.100",
                  color: "text.primary",
                  fontSize: "11px",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "grey.200",
                  },
                }}
              >
                Latest
              </Button>

              {/* Write a Review */}
              {canReview && (
                <Button
                  onClick={() => setIsReviewFormOpen(true)}
                  sx={{
                    height: "32px",
                    px: {
                      xs: "12px",
                      sm: "18px",
                    },
                    borderRadius: 3,
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    fontSize: {
                      xs: "10px",
                      sm: "11px",
                    },
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    "&:hover": {
                      backgroundColor: "primary.main",
                    },
                  }}
                >
                  Write a Review
                </Button>
              )}
            </Box>
          </Box>

          {/* Review form */}
          {canReview && isReviewFormOpen && (
            <Box
              sx={{
                mt: 3,
                mb: 4,
                p: {
                  xs: 2,
                  sm: 3,
                },
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                Write a Review
              </Typography>

              {/* Rating */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1,
                }}
              >
                Rating
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 0.5,
                }}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <IconButton
                    key={star}
                    onClick={() => setReviewRating(star)}
                    sx={{
                      p: 0.5,
                    }}
                  >
                    <Star
                      sx={{
                        color: star <= reviewRating ? "#FFC633" : "grey.300",
                      }}
                    />
                  </IconButton>
                ))}
              </Box>

              {/* Review comment */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 2,
                  mb: 1,
                }}
              >
                Your Review
              </Typography>

              <TextField
                fullWidth
                multiline
                minRows={4}
                placeholder="Write your review..."
                value={reviewComment}
                onChange={(event) => setReviewComment(event.target.value)}
              />

              {/* Submit button */}
              <Button
                variant="contained"
                disabled={
                  reviewRating === 0 ||
                  !reviewComment.trim() ||
                  isSubmittingReview
                }
                onClick={handleSubmitReview}
                sx={{
                  mt: 2,
                  textTransform: "none",
                }}
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </Button>
            </Box>
          )}

          {/* Review cards */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, 1fr)",
              },
              gap: "20px",
            }}
          >
            {reviews.length === 0 ? (
              <Typography
                color="text.secondary"
                sx={{
                  gridColumn: "1 / -1",
                }}
              >
                No reviews yet. Be the first to review this product.
              </Typography>
            ) : (
              reviews.map((review) => (
                <Box
                  key={review.id}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: "16px",
                    p: {
                      xs: "18px",
                      sm: "22px",
                    },
                  }}
                >
                  {/* Rating and menu */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          sx={{
                            fontSize: "18px",
                            color:
                              star <= review.rating ? "#FFC633" : "grey.300",
                          }}
                        />
                      ))}
                    </Box>

                    <IconButton
                      size="small"
                      aria-label="More review options"
                      sx={{
                        p: 0,
                      }}
                    >
                      <MoreHoriz
                        sx={{
                          fontSize: "18px",
                          color: "text.secondary",
                        }}
                      />
                    </IconButton>
                  </Box>

                  {/* Reviewer name */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      mt: "8px",
                      mb: "8px",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                      }}
                    >
                      {review.user_name}
                    </Typography>

                    <Box
                      sx={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%",
                        backgroundColor: "#00C853",
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "9px",
                      }}
                    >
                      ✓
                    </Box>
                  </Box>

                  {/* Review text */}
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "text.secondary",
                      lineHeight: 1.7,
                      mb: "12px",
                    }}
                  >
                    {review.comment}
                  </Typography>

                  {/* Date */}
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "text.secondary",
                    }}
                  >
                    Posted on {new Date(review.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
              ))
            )}
          </Box>

          {/* Load more */}
          {reviews.length > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: "24px",
              }}
            >
              <Button
                sx={{
                  minWidth: "145px",
                  height: "40px",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                  color: "text.primary",
                  fontSize: "11px",
                  textTransform: "none",
                  backgroundColor: "background.paper",
                  "&:hover": {
                    backgroundColor: "grey.100",
                  },
                }}
              >
                Load More Reviews
              </Button>
            </Box>
          )}
        </Box>
      )}

      {activeTab === "faqs" && (
        <Box sx={{ py: "30px" }}>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: 600,
              mb: "20px",
            }}
          >
            Frequently Asked Questions
          </Typography>

          {faqs.map((faq) => (
            <Box
              key={faq.question}
              sx={{
                py: "16px",
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 600,
                  mb: "6px",
                }}
              >
                {faq.question}
              </Typography>

              <Typography
                sx={{
                  fontSize: "13px",
                  color: "text.secondary",
                  lineHeight: 1.6,
                }}
              >
                {faq.answer}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* You might also like */}
      <Box
        sx={{
          mt: {
            xs: "40px",
            md: "60px",
          },
          mb: {
            xs: "40px",
            md: "60px",
          },
        }}
      >
        <Typography
          sx={{
            textAlign: "center",
            fontFamily: '"Arial Black", Arial, sans-serif',
            fontWeight: 900,
            fontSize: {
              xs: "24px",
              sm: "30px",
              md: "36px",
            },
            mb: {
              xs: "24px",
              md: "36px",
            },
          }}
        >
          YOU MIGHT ALSO LIKE
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: {
              xs: "16px 12px",
              sm: "20px",
              md: "20px",
            },
          }}
        >
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
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

export default ProductDetail;
