import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Box,
  Button,
  Badge,
  Menu,
  MenuItem,
  Drawer,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { logout } from "../redux/auth/authSlice";
import { getBrands } from "../services/brandService";
import type { Brand } from "../services/brandService";
import { getProducts } from "../services/productService";
import type { Product } from "../types/product";

interface NavbarProps {
  onLogin: () => void;
}

function Navbar({ onLogin }: NavbarProps) {
  const [shopMenu, setShopMenu] = useState<null | HTMLElement>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [accountMenu, setAccountMenu] = useState<null | HTMLElement>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandMenu, setBrandMenu] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);
  const [mobileBrandOpen, setMobileBrandOpen] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const cartItems = useAppSelector((state) => state.cart.items);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleShopClick = (event: React.MouseEvent<HTMLElement>) => {
    setShopMenu(event.currentTarget);
  };

  const handleShopClose = () => {
    setShopMenu(null);
  };

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setSearchQuery("");
    setMobileSearchOpen(false);
  }, [location.pathname, location.search]);

  const handleBrandOpen = (event: React.MouseEvent<HTMLElement>) => {
    setBrandMenu(event.currentTarget);
  };

  const handleBrandClose = () => {
    setBrandMenu(null);
  };

  const handleSearch = () => {
    const query = searchQuery.trim();

    if (!query) return;

    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const searchSuggestions = searchQuery.trim()
    ? products
        .filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .slice(0, 5)
    : [];

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
      }}
    >
      <Toolbar
        sx={{
          minHeight: {
            xs: 64,
            md: 72,
          },
          px: {
            xs: 2,
            md: 6,
          },
        }}
      >
        {/* Mobile menu */}
        <IconButton
          onClick={() => setMobileMenu(true)}
          sx={{
            display: {
              xs: "flex",
              md: "none",
            },
            color: "text.primary",
            padding: 0,
            mr: 1.5,
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Typography
          onClick={() => navigate("/")}
          sx={{
            fontWeight: 700,
            color: "text.primary",
            fontSize: {
              xs: "20px",
              md: "28px",
            },
            cursor: "pointer",
          }}
        >
          STYLE.CO
        </Typography>

        {/* Desktop navigation */}
        <Box
          sx={{
            display: {
              xs: "none",
              md: "flex",
            },
            alignItems: "center",
            ml: 5,
          }}
        >
          {/* Shop dropdown */}
          <Button
            onClick={handleShopClick}
            endIcon={<KeyboardArrowDownIcon />}
            sx={{
              color: "text.primary",
              fontSize: "16px",
              fontWeight: 400,
              textTransform: "none",
              minWidth: "auto",
              p: 0,
              mr: 3,
            }}
          >
            Shop
          </Button>

          <Menu
            anchorEl={shopMenu}
            open={Boolean(shopMenu)}
            onClose={handleShopClose}
          >
            <MenuItem
              onClick={() => {
                handleShopClose();
                navigate("/category/men");
              }}
            >
              Men
            </MenuItem>

            <MenuItem
              onClick={() => {
                handleShopClose();
                navigate("/category/women");
              }}
            >
              Women
            </MenuItem>
          </Menu>
          <Typography
            onClick={() => navigate("/sale")}
            sx={{
              color: "text.primary",
              fontSize: "16px",
              fontWeight: 400,
              cursor: "pointer",
              mr: 3,
            }}
          >
            On Sale
          </Typography>

          <Typography
            onClick={() => navigate("/new-arrivals")}
            sx={{
              color: "text.primary",
              fontSize: "16px",
              fontWeight: 400,
              cursor: "pointer",
              mr: 3,
            }}
          >
            New Arrivals
          </Typography>

          <Typography
            onClick={handleBrandOpen}
            sx={{
              color: "text.primary",
              fontSize: "16px",
              fontWeight: 400,
              cursor: "pointer",
            }}
          >
            Brands
          </Typography>
          <Menu
            anchorEl={brandMenu}
            open={Boolean(brandMenu)}
            onClose={handleBrandClose}
          >
            {brands.map((brand) => (
              <MenuItem
                key={brand.id}
                onClick={() => {
                  handleBrandClose();
                  navigate(`/category?brand=${brand.id}`);
                }}
              >
                {brand.name}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Desktop search */}
        <Box
          sx={{
            position: "relative",
            display: {
              xs: "none",
              md: "flex",
            },
            alignItems: "center",
            bgcolor: "grey.100",
            borderRadius: 5,
            px: 2,
            width: 500,
          }}
        >
          <SearchIcon color="action" />

          <InputBase
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearch();
              }
            }}
            sx={{
              ml: 1,
              flex: 1,
              color: "text.primary",
            }}
          />
          {searchSuggestions.length > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                mt: 1,
                backgroundColor: "background.paper",
                borderRadius: 2,
                boxShadow: 3,
                zIndex: 10,
                overflow: "hidden",
              }}
            >
              {searchSuggestions.map((product) => (
                <Box
                  key={product.id}
                  onClick={() => {
                    navigate(`/product/${product.id}`);
                    setSearchQuery("");
                  }}
                  sx={{
                    px: 2,
                    py: 1.5,
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "grey.100",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: "text.primary",
                    }}
                  >
                    {product.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Mobile / Tablet search */}
        <Box
          sx={{
            display: {
              xs: "flex",
              md: "none",
            },
            alignItems: "center",
            ml: "auto",
          }}
        >
          {!mobileSearchOpen ? (
            <IconButton
              onClick={() => setMobileSearchOpen(true)}
              sx={{
                color: "text.primary",
              }}
            >
              <SearchIcon />
            </IconButton>
          ) : (
            <Box
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 20,
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1.5,
                backgroundColor: "background.paper",
                borderTop: "1px solid",
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flex: 1,
                  backgroundColor: "grey.100",
                  borderRadius: 5,
                  px: 2,
                  height: 42,
                }}
              >
                <SearchIcon
                  sx={{
                    color: "text.secondary",
                    fontSize: 20,
                  }}
                />

                <InputBase
                  autoFocus
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSearch();
                      setMobileSearchOpen(false);
                    }
                  }}
                  sx={{
                    ml: 1,
                    flex: 1,
                    color: "text.primary",
                  }}
                />

                {searchSuggestions.length > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: "100%",
                      left: 16,
                      right: 16,
                      mt: 1,
                      backgroundColor: "background.paper",
                      borderRadius: 2,
                      boxShadow: 3,
                      zIndex: 30,
                      overflow: "hidden",
                    }}
                  >
                    {searchSuggestions.map((product) => (
                      <Box
                        key={product.id}
                        onClick={() => {
                          navigate(`/product/${product.id}`);
                          setSearchQuery("");
                          setMobileSearchOpen(false);
                        }}
                        sx={{
                          px: 2,
                          py: 1.5,
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: "grey.100",
                          },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 14,
                          }}
                        >
                          {product.name}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {searchQuery && (
                  <IconButton size="small" onClick={() => setSearchQuery("")}>
                    <CloseIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                )}
              </Box>

              <IconButton
                onClick={() => {
                  setMobileSearchOpen(false);
                  setSearchQuery("");
                }}
                sx={{
                  color: "text.primary",
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* Cart */}
        <IconButton
          onClick={() => navigate("/cart")}
          sx={{
            color: "text.primary",
          }}
        >
          <Badge
            badgeContent={cartCount}
            color="primary"
            invisible={cartCount === 0}
          >
            <ShoppingCartOutlinedIcon />
          </Badge>
        </IconButton>

        {/* Account */}
        <Box
          onClick={(event) => {
            if (isAuthenticated) {
              setAccountMenu(event.currentTarget);
            } else {
              onLogin();
            }
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            cursor: "pointer",
            color: "text.primary",
          }}
        >
          <IconButton
            sx={{
              color: "text.primary",
              p: 0,
            }}
          >
            <AccountCircleOutlinedIcon />
          </IconButton>

          {isAuthenticated && user && (
            <Typography
              sx={{
                display: {
                  xs: "none",
                  md: "block",
                },
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Hi, {user.first_name}
            </Typography>
          )}
        </Box>
        <Menu
          anchorEl={accountMenu}
          open={Boolean(accountMenu)}
          onClose={() => setAccountMenu(null)}
        >
          {user && (
            <MenuItem disabled>
              <Typography
                sx={{
                  fontWeight: 600,
                  color: "text.primary",
                }}
              >
                {user.first_name} {user.last_name}
              </Typography>
            </MenuItem>
          )}

          <MenuItem
            onClick={() => {
              setAccountMenu(null);
              navigate("/orders");
            }}
          >
            My Orders
          </MenuItem>

          <MenuItem
            onClick={() => {
              dispatch(logout());
              setAccountMenu(null);
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
      <Box
        sx={{
          width: {
            xs: "calc(100% - 32px)",
            sm: "calc(100% - 40px)",
            md: "calc(100% - 48px)",
            lg: "calc(100% - 116px)",
          },
          maxWidth: "2000px",
          mx: "auto",
          borderBottom: 1,
          borderColor: "divider",
        }}
      />

      <Drawer
        anchor="left"
        open={mobileMenu}
        onClose={() => setMobileMenu(false)}
      >
        <Box
          sx={{
            width: 280,
            p: 3,
          }}
        >
          {/* Logo */}
          <Typography
            onClick={() => {
              setMobileMenu(false);
              navigate("/");
            }}
            sx={{
              fontSize: 24,
              fontWeight: 700,
              color: "text.primary",
              mb: 4,
              cursor: "pointer",
            }}
          >
            STYLE.CO
          </Typography>

          {/* Shop */}
          <Box sx={{ mb: 3 }}>
            <Box
              onClick={() => setMobileShopOpen(!mobileShopOpen)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              <Typography>Shop</Typography>

              <KeyboardArrowDownIcon
                sx={{
                  transform: mobileShopOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "0.2s",
                }}
              />
            </Box>

            {mobileShopOpen && (
              <Box sx={{ pl: 2, mt: 2 }}>
                <Typography
                  onClick={() => {
                    setMobileMenu(false);
                    navigate("/category/men");
                  }}
                  sx={{
                    mb: 2,
                    cursor: "pointer",
                    color: "text.secondary",
                  }}
                >
                  Men
                </Typography>

                <Typography
                  onClick={() => {
                    setMobileMenu(false);
                    navigate("/category/women");
                  }}
                  sx={{
                    cursor: "pointer",
                    color: "text.secondary",
                  }}
                >
                  Women
                </Typography>
              </Box>
            )}
          </Box>

          {/* On Sale */}
          <Typography
            onClick={() => {
              setMobileMenu(false);
              navigate("/sale");
            }}
            sx={{
              mb: 3,
              cursor: "pointer",
            }}
          >
            On Sale
          </Typography>

          {/* New Arrivals */}
          <Typography
            onClick={() => {
              setMobileMenu(false);
              navigate("/new-arrivals");
            }}
            sx={{
              mb: 3,
              cursor: "pointer",
            }}
          >
            New Arrivals
          </Typography>

          {/* Brands */}
          <Box>
            <Box
              onClick={() => setMobileBrandOpen(!mobileBrandOpen)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              <Typography>Brands</Typography>

              <KeyboardArrowDownIcon
                sx={{
                  transform: mobileBrandOpen
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  transition: "0.2s",
                }}
              />
            </Box>

            {mobileBrandOpen && (
              <Box sx={{ pl: 2, mt: 2 }}>
                {brands.map((brand) => (
                  <Typography
                    key={brand.id}
                    onClick={() => {
                      setMobileMenu(false);
                      navigate(`/category?brand=${brand.id}`);
                    }}
                    sx={{
                      mb: 2,
                      cursor: "pointer",
                      color: "text.secondary",
                    }}
                  >
                    {brand.name}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}

export default Navbar;
