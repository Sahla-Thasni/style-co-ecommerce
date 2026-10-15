import {
  Box,
  Container,
  Typography,
  Pagination,
  Drawer,
  Select,
  MenuItem,
} from "@mui/material";
import CategoryFilters from "./CategoryFilters";
import TuneIcon from "@mui/icons-material/Tune";

import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import {
  getProducts,
  getTopSellingProducts,
} from "../../services/productService";
import type { Product } from "../../types/product";

function Category() {
  const location = useLocation();
  // Get category from URL and handle navigation
  const navigate = useNavigate();
  const { category: routeCategory } = useParams();

  const [searchParams] = useSearchParams();

  const brandId = searchParams.get("brand");
  const selectedCategory = searchParams.get("category");
  const isTopSelling = searchParams.get("top-selling") === "true";
  const selectedStyle = searchParams.get("style");

  const isSalePage = location.pathname === "/sale";

  const gender =
    routeCategory === "men" || routeCategory === "women" ? routeCategory : null;
  const [products, setProducts] = useState<Product[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState("popular");

  const productsPerPage = 9;

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = isTopSelling
          ? await getTopSellingProducts()
          : await getProducts();

        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [isTopSelling]);

  // Reset pagination when category or filters change
  useEffect(() => {
    setPage(1);
  }, [
    routeCategory,
    selectedCategory,
    brandId,
    selectedStyle,
    priceRange,
    selectedColors,
    selectedStyles,
    selectedSizes,
    sortOption,
  ]);

  // Apply category and filter conditions
  const filteredProducts = products.filter((product) => {
    const matchesSale =
      !isSalePage || Number(product.discount_percentage) >= 30;

    const matchesGender =
      gender === null || product.gender.toLowerCase() === gender;

    const matchesCategory = selectedCategory
      ? product.category.name.toLowerCase() === selectedCategory.toLowerCase()
      : gender
        ? true
        : routeCategory
          ? product.category.name.toLowerCase() === routeCategory.toLowerCase()
          : true;

    const matchesBrand = !brandId || product.brand?.id === Number(brandId);

    const price = Number(product.discount_price);

    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

    const matchesColor =
      selectedColors.length === 0 ||
      product.variants.some((variant) =>
        selectedColors.includes(variant.color),
      );

    const matchesStyle = selectedStyle
      ? product.style?.name?.toLowerCase() === selectedStyle.toLowerCase()
      : selectedStyles.length === 0 ||
        (product.style?.name !== undefined &&
          selectedStyles.includes(product.style.name));

    const matchesSize =
      selectedSizes.length === 0 ||
      product.variants.some((variant) => selectedSizes.includes(variant.size));

    return (
      matchesSale &&
      matchesGender &&
      matchesCategory &&
      matchesBrand &&
      matchesPrice &&
      matchesColor &&
      matchesStyle &&
      matchesSize
    );
  });

  // Sort filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "low-high") {
      return Number(a.discount_price) - Number(b.discount_price);
    }

    if (sortOption === "high-low") {
      return Number(b.discount_price) - Number(a.discount_price);
    }

    if (sortOption === "newest") {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    return 0;
  });

  // Get products for the current page
  const startIndex = (page - 1) * productsPerPage;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + productsPerPage,
  );

  return (
    <Box>
      <Container
        maxWidth={false}
        sx={{
          maxWidth: "1280px",
          mx: "auto",
          px: { xs: 2, md: 0 },
        }}
      >
        {/* Breadcrumb */}
        <Typography
          sx={{
            mt: 3,
            fontSize: 14,
            color: "text.secondary",
          }}
        >
          Home &nbsp;›&nbsp;
          {selectedStyle ? (
            selectedStyle.charAt(0).toUpperCase() + selectedStyle.slice(1)
          ) : isSalePage ? (
            "On Sale"
          ) : brandId ? (
            <>
              Brands &nbsp;›&nbsp;
              {
                products.find(
                  (product) => product.brand?.id === Number(brandId),
                )?.brand?.name
              }
            </>
          ) : gender ? (
            <>
              Shop &nbsp;›&nbsp;
              {gender.charAt(0).toUpperCase() + gender.slice(1)}
            </>
          ) : routeCategory ? (
            routeCategory.charAt(0).toUpperCase() + routeCategory.slice(1)
          ) : selectedCategory ? (
            selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)
          ) : (
            ""
          )}
        </Typography>

        {/* Main content */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "200px minmax(0, 1fr)",
            },
            gap: 3,
            mt: 2,
          }}
        >
          {/* Filters */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: 2,
              height: "fit-content",
            }}
          >
            <CategoryFilters
              onCategorySelect={(selectedCategory) => {
                if (gender) {
                  navigate(
                    `/category/${gender}?category=${encodeURIComponent(
                      selectedCategory.toLowerCase(),
                    )}`,
                  );
                } else {
                  navigate(`/category/${selectedCategory.toLowerCase()}`);
                }
              }}
              onPriceChange={setPriceRange}
              onColorChange={setSelectedColors}
              onStyleChange={setSelectedStyles}
              onSizeChange={setSelectedSizes}
            />
          </Box>

          {/* Product area */}
          <Box>
            {/* Product header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 3,
              }}
            >
              <Box>
                <Typography
                  component="h1"
                  sx={{
                    fontSize: { xs: 24, md: 32 },
                    fontWeight: 700,
                  }}
                >
                  {isSalePage
                    ? "On Sale"
                    : brandId
                      ? products.find(
                          (product) => product.brand?.id === Number(brandId),
                        )?.brand?.name
                      : selectedCategory
                        ? selectedCategory.charAt(0).toUpperCase() +
                          selectedCategory.slice(1)
                        : routeCategory
                          ? routeCategory.charAt(0).toUpperCase() +
                            routeCategory.slice(1)
                          : ""}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: 13,
                    color: "text.secondary",
                  }}
                >
                  Showing 1–9 of 20 Products
                </Typography>
              </Box>

              {/* Mobile filter icon */}
              <Box
                sx={{
                  display: { xs: "flex", md: "none" },
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  backgroundColor: "grey.100",
                  cursor: "pointer",
                  flexShrink: 0,
                  mt: 0.5,
                }}
                onClick={() => setFilterOpen(true)}
              >
                <TuneIcon
                  sx={{
                    fontSize: 17,
                    color: "text.primary",
                  }}
                />
              </Box>

              {/* Desktop sort */}
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    color: "text.secondary",
                  }}
                >
                  Sort by:
                </Typography>

                <Select
                  value={sortOption}
                  onChange={(event) => setSortOption(event.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{
                    minWidth: 150,
                    fontSize: 13,
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                >
                  <MenuItem value="popular">Most Popular</MenuItem>
                  <MenuItem value="low-high">Price: Low to High</MenuItem>
                  <MenuItem value="high-low">Price: High to Low</MenuItem>
                  <MenuItem value="newest">Newest</MenuItem>
                </Select>
              </Box>
            </Box>
            {/* Product grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, minmax(0, 1fr))",
                  md: "repeat(3, minmax(0, 1fr))",
                },
                gap: { xs: 2, md: 3 },
              }}
            >
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </Box>
          </Box>
        </Box>
        {/* Pagination */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 5,
            mb: 4,
          }}
        >
          <Pagination
            count={Math.ceil(filteredProducts.length / productsPerPage)}
            page={page}
            onChange={(_, value) => setPage(value)}
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                fontSize: 13,
              },
              "& .Mui-selected": {
                backgroundColor: "primary.main",
                color: "primary.contrastText",
              },
            }}
          />
        </Box>
        {/* Mobile filter drawer */}
        <Drawer
          anchor="left"
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
        >
          <Box
            sx={{
              width: { xs: 300, sm: 340 },
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Drawer header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                Filters
              </Typography>

              <Typography
                component="button"
                onClick={() => setFilterOpen(false)}
                sx={{
                  border: 0,
                  background: "transparent",
                  fontSize: 14,
                  color: "text.secondary",
                  cursor: "pointer",
                  p: 0,
                }}
              >
                Close
              </Typography>
            </Box>

            {/* Filters */}
            <Box
              sx={{
                p: 2,
                overflowY: "auto",
              }}
            >
              <CategoryFilters
                showHeader={false}
                onCategorySelect={(selectedCategory) => {
                  if (gender) {
                    navigate(
                      `/category/${gender}?category=${encodeURIComponent(
                        selectedCategory.toLowerCase(),
                      )}`,
                    );
                  } else {
                    navigate(`/category/${selectedCategory.toLowerCase()}`);
                  }
                }}
                onPriceChange={setPriceRange}
                onColorChange={setSelectedColors}
                onStyleChange={setSelectedStyles}
                onSizeChange={setSelectedSizes}
                onApply={() => setFilterOpen(false)}
              />
            </Box>
          </Box>
        </Drawer>
      </Container>
    </Box>
  );
}

export default Category;
