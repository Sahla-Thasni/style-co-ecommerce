import { Box, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TuneIcon from "@mui/icons-material/Tune";
import { Slider } from "@mui/material";

import { useEffect, useState } from "react";
import { getCategories } from "../../services/productService";

interface CategoryFiltersProps {
  onApply?: () => void;
  showHeader?: boolean;
  onCategorySelect?: (category: string) => void;
  onPriceChange?: (range: number[]) => void;
  onColorChange?: (colors: string[]) => void;
  onStyleChange?: (styles: string[]) => void;
  onSizeChange?: (sizes: string[]) => void;
}
function CategoryFilters({
  onApply,
  showHeader = true,
  onCategorySelect,
  onPriceChange,
  onColorChange,
  onStyleChange,
  onSizeChange,
}: CategoryFiltersProps) {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  const colors = [
    "Black",
    "White",
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Purple",
    "Pink",
    "Navy",
    "Gray",
    "Orange",
  ];
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  return (
    <Box>
      {showHeader && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography sx={{ fontWeight: 600 }}>Filters</Typography>

          <TuneIcon
            sx={{
              fontSize: 18,
              color: "text.secondary",
            }}
          />
        </Box>
      )}

      {/* Categories */}
      <Box
        sx={{
          py: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        {categories.map((category) => (
          <Box
            key={category.id}
            onClick={() => onCategorySelect?.(category.name)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 0.7,
              cursor: "pointer",
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                color: "text.secondary",
              }}
            >
              {category.name}
            </Typography>

            <ChevronRightIcon
              sx={{
                fontSize: 17,
                color: "text.secondary",
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Price */}
      <Box
        sx={{
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography sx={{ fontWeight: 600, mb: 2 }}>Price</Typography>

        <Slider
          value={priceRange}
          min={0}
          max={1000}
          onChange={(_, newValue) => {
            const range = newValue as number[];
            setPriceRange(range);
            onPriceChange?.(range);
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
            ${priceRange[0]}
          </Typography>

          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
            ${priceRange[1]}
          </Typography>
        </Box>
      </Box>

      {/* Colors */}
      <Box
        sx={{
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography sx={{ fontWeight: 600, mb: 2 }}>Colors</Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.2,
          }}
        >
          {colors.map((color) => (
            <Box
              key={color}
              title={color}
              onClick={() => {
                setSelectedColors((prev) => {
                  const updatedColors = prev.includes(color)
                    ? prev.filter((item) => item !== color)
                    : [...prev, color];

                  onColorChange?.(updatedColors);

                  return updatedColors;
                });
              }}
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                backgroundColor: color.toLowerCase(),
                border: "2px solid",
                borderColor: selectedColors.includes(color)
                  ? "primary.main"
                  : "divider",
                cursor: "pointer",
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Dress Style */}
      <Box
        sx={{
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography sx={{ fontWeight: 600, mb: 2 }}>Dress Style</Typography>

        {["Casual", "Formal", "Party", "Gym"].map((style) => (
          <Box
            key={style}
            onClick={() => {
              setSelectedStyles((prev) => {
                const updatedStyles = prev.includes(style)
                  ? prev.filter((item) => item !== style)
                  : [...prev, style];

                onStyleChange?.(updatedStyles);

                return updatedStyles;
              });
            }}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 0.8,
              cursor: "pointer",
            }}
          >
            <Typography
              sx={{
                fontSize: 13,
                color: selectedStyles.includes(style)
                  ? "primary.main"
                  : "text.secondary",
                fontWeight: selectedStyles.includes(style) ? 600 : 400,
              }}
            >
              {style}
            </Typography>

            <ChevronRightIcon
              sx={{
                fontSize: 17,
                color: selectedStyles.includes(style)
                  ? "primary.main"
                  : "text.secondary",
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Size */}
      <Box
        sx={{
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography sx={{ fontWeight: 600, mb: 2 }}>Size</Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {["XX-Small", "X-Small", "Small", "Medium", "Large", "X-Large"].map(
            (size) => (
              <Box
                key={size}
                onClick={() => {
                  setSelectedSizes((prev) => {
                    const updatedSizes = prev.includes(size)
                      ? prev.filter((item) => item !== size)
                      : [...prev, size];

                    onSizeChange?.(updatedSizes);

                    return updatedSizes;
                  });
                }}
                sx={{
                  px: 1.5,
                  py: 0.8,
                  borderRadius: 5,
                  backgroundColor: selectedSizes.includes(size)
                    ? "primary.main"
                    : "grey.100",
                  cursor: "pointer",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 11,
                    color: selectedSizes.includes(size)
                      ? "primary.contrastText"
                      : "text.secondary",
                    whiteSpace: "nowrap",
                  }}
                >
                  {size}
                </Typography>
              </Box>
            ),
          )}
        </Box>
      </Box>

      {/* Apply Filters */}
      <Box
        sx={{
          mt: 3,
          pt: 2,
          borderColor: "divider",
        }}
      >
        <Box
          component="button"
          onClick={onApply}
          sx={{
            width: "100%",
            py: 1.5,
            border: "none",
            borderRadius: 2,
            backgroundColor: "primary.main",
            color: "primary.contrastText",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Apply Filters
        </Box>
      </Box>
    </Box>
  );
}

export default CategoryFilters;
