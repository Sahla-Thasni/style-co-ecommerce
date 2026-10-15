import { Box, Container, Typography, Pagination, Drawer } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";

import { useEffect, useState } from "react";
import CategoryFilters from "../category/CategoryFilters";
import ProductCard from "../../components/ProductCard";
import { getProducts } from "../../services/productService";
import type { Product } from "../../types/product";

function NewArrivalsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [page, setPage] = useState(1);

  const productsPerPage = 9;

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch new arrivals:", error);
      }
    };

    fetchProducts();
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
  }, [
    selectedCategory,
    priceRange,
    selectedColors,
    selectedStyles,
    selectedSizes,
  ]);

  // Apply filters
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "" ||
      product.category.name.toLowerCase() === selectedCategory.toLowerCase();

    const price = Number(product.discount_price);

    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

    const matchesColor =
      selectedColors.length === 0 ||
      product.variants.some((variant) =>
        selectedColors.includes(variant.color),
      );

    const matchesStyle =
      selectedStyles.length === 0 ||
      (product.style?.name !== undefined &&
        selectedStyles.includes(product.style.name));

    const matchesSize =
      selectedSizes.length === 0 ||
      product.variants.some((variant) => selectedSizes.includes(variant.size));

    return (
      matchesCategory &&
      matchesPrice &&
      matchesColor &&
      matchesStyle &&
      matchesSize
    );
  });

  // Newest products first
  const sortedProducts = [...filteredProducts].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  // Get products for current page
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
          Home &nbsp;›&nbsp; New Arrivals
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
          {/* Desktop filters */}
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
              onCategorySelect={setSelectedCategory}
              onPriceChange={setPriceRange}
              onColorChange={setSelectedColors}
              onStyleChange={setSelectedStyles}
              onSizeChange={setSelectedSizes}
            />
          </Box>

          {/* Product area */}
          <Box>
            {/* Header */}
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
                  New Arrivals
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: 13,
                    color: "text.secondary",
                  }}
                >
                  Showing {startIndex + 1}–
                  {Math.min(
                    startIndex + productsPerPage,
                    sortedProducts.length,
                  )}{" "}
                  of {sortedProducts.length} Products
                </Typography>
              </Box>

              {/* Mobile filter button */}
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
            count={Math.ceil(sortedProducts.length / productsPerPage)}
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

            {/* Mobile filters */}
            <Box
              sx={{
                p: 2,
                overflowY: "auto",
              }}
            >
              <CategoryFilters
                showHeader={false}
                onCategorySelect={setSelectedCategory}
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

export default NewArrivalsPage;
