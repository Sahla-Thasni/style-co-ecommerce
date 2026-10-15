import { Box, Typography, Button } from "@mui/material";

import heroModel from "../../assets/hero-model.jpg";
import {
  versaceLogo,
  zaraLogo,
  gucciLogo,
  pradaLogo,
  calvinKleinLogo,
} from "../../assets/brands";

import NewArrivals from "../../components/NewArrivals";
import TopSelling from "../../components/TopSelling";
import DressStyle from "../../components/DressStyle";
import HappyCustomers from "../../components/HappyCustomers";
import { useNavigate } from "react-router-dom";
import { getBrands, type Brand } from "../../services/brandService";
import { useEffect, useState } from "react";

function Home() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<Brand[]>([]);

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

  const handleBrandClick = (brandName: string) => {
    const brand = brands.find(
      (item) => item.name.toLowerCase() === brandName.toLowerCase(),
    );

    if (brand) {
      navigate(`/category?brand=${brand.id}`);
    }
  };

  return (
    <Box>
      {/* Hero section */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: {
            xs: "800px",
            lg: "663px",
          },
          minHeight: {
            xs: "800px",
            lg: "663px",
          },
          backgroundColor: "#F2F0F1",
          overflow: "hidden",
        }}
      >
        {/* Hero content */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            ml: {
              xs: "16px",
              lg: "100px",
            },
            pt: {
              xs: "40px",
              lg: "102px",
            },
            width: {
              xs: "calc(100% - 32px)",
              lg: "577px",
            },
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Arial Black", Arial, sans-serif',
              fontWeight: 900,
              fontSize: {
                xs: "36px",
                sm: "40px",
                md: "48px",
                lg: "64px",
              },
              lineHeight: {
                xs: "36px",
                sm: "40px",
                md: "48px",
                lg: "64px",
              },
              letterSpacing: "-1px",
              color: "#000000",
              width: "100%",
            }}
          >
            FIND CLOTHES
            <br />
            THAT MATCHES
            <br />
            YOUR STYLE
          </Typography>

          {/* Hero description */}
          <Typography
            sx={{
              mt: {
                xs: "12px",
                lg: "32px",
              },
              width: {
                xs: "100%",
                lg: "545px",
              },
              fontFamily: "Arial, sans-serif",
              fontSize: {
                xs: "14px",
                lg: "16px",
              },
              lineHeight: {
                xs: "20px",
                lg: "22px",
              },
              fontWeight: 400,
              color: "#000000",
              opacity: 0.6,
            }}
          >
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of
            style.
          </Typography>

          {/* Shop button */}
          <Button
            onClick={() => navigate("/category")}
            variant="contained"
            sx={{
              mt: {
                xs: "12px",
                lg: "32px",
              },
              width: {
                xs: "100%",
                lg: "210px",
              },
              height: "52px",
              backgroundColor: "#000000",
              color: "#FFFFFF",
              borderRadius: "26px",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 500,
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#000000",
                boxShadow: "none",
              },
            }}
          >
            Shop Now
          </Button>

          {/* Mobile statistics */}
          <Box
            sx={{
              display: {
                xs: "block",
                lg: "none",
              },
              mt: "20px",
            }}
          >
            {/* First two statistics */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: "50%",
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "24px",
                    lineHeight: "30px",
                    fontWeight: 500,
                    color: "#000000",
                  }}
                >
                  200+
                </Typography>

                <Typography
                  sx={{
                    fontSize: "12px",
                    lineHeight: "16px",
                    color: "#000000",
                    opacity: 0.6,
                  }}
                >
                  International Brands
                </Typography>
              </Box>

              {/* Divider */}
              <Box
                sx={{
                  width: "1px",
                  height: "50px",
                  backgroundColor: "#000000",
                  opacity: 0.1,
                }}
              />

              <Box
                sx={{
                  width: "50%",
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "24px",
                    lineHeight: "30px",
                    fontWeight: 500,
                    color: "#000000",
                  }}
                >
                  2,000+
                </Typography>

                <Typography
                  sx={{
                    fontSize: "12px",
                    lineHeight: "16px",
                    color: "#000000",
                    opacity: 0.6,
                  }}
                >
                  High-Quality Products
                </Typography>
              </Box>
            </Box>

            {/* Third statistic */}
            <Box
              sx={{
                textAlign: "center",
                mt: "16px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "24px",
                  lineHeight: "30px",
                  fontWeight: 500,
                  color: "#000000",
                }}
              >
                30,000+
              </Typography>

              <Typography
                sx={{
                  fontSize: "12px",
                  lineHeight: "16px",
                  color: "#000000",
                  opacity: 0.6,
                }}
              >
                Happy Customers
              </Typography>
            </Box>
          </Box>

          {/* Desktop statistics */}
          <Box
            sx={{
              display: {
                xs: "none",
                lg: "flex",
              },
              alignItems: "center",
              mt: "52px",
              width: "596px",
            }}
          >
            <Box sx={{ pr: "32px" }}>
              <Typography
                sx={{
                  fontSize: "40px",
                  lineHeight: "48px",
                  fontWeight: 500,
                  color: "#000000",
                }}
              >
                200+
              </Typography>

              <Typography
                sx={{
                  fontSize: "16px",
                  lineHeight: "22px",
                  color: "#000000",
                  opacity: 0.6,
                }}
              >
                International Brands
              </Typography>
            </Box>

            <Box
              sx={{
                width: "1px",
                height: "50px",
                backgroundColor: "#000000",
                opacity: 0.1,
              }}
            />

            <Box sx={{ px: "32px" }}>
              <Typography
                sx={{
                  fontSize: "40px",
                  lineHeight: "48px",
                  fontWeight: 500,
                  color: "#000000",
                }}
              >
                2,000+
              </Typography>

              <Typography
                sx={{
                  fontSize: "16px",
                  lineHeight: "22px",
                  color: "#000000",
                  opacity: 0.6,
                }}
              >
                High-Quality Products
              </Typography>
            </Box>

            <Box
              sx={{
                width: "1px",
                height: "50px",
                backgroundColor: "#000000",
                opacity: 0.1,
              }}
            />

            <Box sx={{ pl: "32px" }}>
              <Typography
                sx={{
                  fontSize: "40px",
                  lineHeight: "48px",
                  fontWeight: 500,
                  color: "#000000",
                }}
              >
                30,000+
              </Typography>

              <Typography
                sx={{
                  fontSize: "16px",
                  lineHeight: "22px",
                  color: "#000000",
                  opacity: 0.6,
                }}
              >
                Happy Customers
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Small decorative star */}
        <Typography
          sx={{
            position: "absolute",
            zIndex: 3,
            top: {
              xs: "500px",
              lg: "275px",
            },
            left: {
              xs: "18px",
              lg: "820px",
            },
            fontSize: {
              xs: "40px",
              lg: "65px",
            },
            lineHeight: 1,
            color: "#000000",
          }}
        >
          ✦
        </Typography>

        {/* Big decorative star */}
        <Typography
          sx={{
            position: "absolute",
            zIndex: 3,
            top: {
              xs: "420px",
              lg: "45px",
            },
            right: {
              xs: "50px",
              lg: "100px",
            },
            fontSize: {
              xs: "80px",
              lg: "105px",
            },
            lineHeight: 1,
            color: "#000000",
          }}
        >
          ✦
        </Typography>

        {/* Hero image */}
        <Box
          component="img"
          src={heroModel}
          alt="Fashion models"
          sx={{
            position: "absolute",
            zIndex: 1,
            top: {
              xs: "390px",
              sm: "430px",
              md: "450px",
              lg: "auto",
            },
            bottom: {
              xs: "auto",
              sm: "auto",
              md: "auto",
              lg: 0,
            },
            left: {
              xs: "auto",
              sm: "42%",
              md: "42%",
              lg: "auto",
            },
            right: {
              xs: "-25px",
              sm: "auto",
              md: "auto",
              lg: "70px",
            },
            transform: {
              xs: "none",
              sm: "translateX(-50%)",
              md: "translateX(50%)",
              lg: "none",
            },
            width: {
              xs: "450px",
              sm: "480px",
              md: "500px",
              lg: "800px",
            },
            height: {
              xs: "400px",
              sm: "460px",
              md: "480px",
              lg: "745px",
            },
            objectFit: "contain",
          }}
        />
      </Box>
      {/* ---------------------------------------------------------------------------------------------------   */}

      {/* Brand logo section */}
      <Box
        sx={{
          backgroundColor: "#000000",
          minHeight: {
            xs: "150px",
            sm: "150px",
            md: "150px",
            lg: "120px",
          },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: {
            xs: "20px",
            sm: "30px",
            md: "40px",
            lg: "50px",
          },
          py: {
            xs: "20px",
            lg: "25px",
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "1400px",
            mx: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: {
              xs: "wrap",
              sm: "wrap",
              md: "wrap",
              lg: "nowrap",
            },
            columnGap: {
              xs: "20px",
              sm: "30px",
              md: "40px",
              lg: "0px",
            },
            rowGap: {
              xs: "20px",
              sm: "30px",
              md: "25px",
              lg: "0px",
            },
            px: {
              xs: "15px",
              sm: "30px",
              md: "60px",
              lg: "40px",
            },
          }}
        >
          {/* Versace */}
          <Box
            component="img"
            src={versaceLogo}
            alt="Versace"
            onClick={() => handleBrandClick("Versace")}
            sx={{
              width: {
                xs: "28%",
                sm: "28%",
                md: "28%",
                lg: "166px",
              },
              cursor: "pointer",
            }}
          />

          {/* Zara */}
          <Box
            component="img"
            src={zaraLogo}
            alt="Zara"
            onClick={() => handleBrandClick("Zara")}
            sx={{
              width: {
                xs: "18%",
                sm: "18%",
                md: "18%",
                lg: "120px",
              },
              cursor: "pointer",
            }}
          />

          {/* Gucci */}
          <Box
            component="img"
            src={gucciLogo}
            alt="Gucci"
            onClick={() => handleBrandClick("Gucci")}
            sx={{
              width: {
                xs: "26%",
                sm: "26%",
                md: "26%",
                lg: "160px",
              },
              cursor: "pointer",
            }}
          />

          {/* Prada */}
          <Box
            component="img"
            src={pradaLogo}
            alt="Prada"
            onClick={() => handleBrandClick("Prada")}
            sx={{
              width: {
                xs: "26%",
                sm: "26%",
                md: "26%",
                lg: "155px",
              },
              cursor: "pointer",
            }}
          />

          {/* Calvin Klein */}
          <Box
            component="img"
            src={calvinKleinLogo}
            alt="Calvin Klein"
            onClick={() => handleBrandClick("Calvin Klein")}
            sx={{
              width: {
                xs: "32%",
                sm: "32%",
                md: "32%",
                lg: "170px",
              },
              cursor: "pointer",
            }}
          />
        </Box>
      </Box>
      {/* ------------------------------------------------------------------------------------------------------------- */}
      {/* New Arrivals */}
      <NewArrivals />

      {/* Section divider */}
      <Box
        sx={{
          width: {
            xs: "calc(100% - 32px)",
            sm: "776px",
            md: "776px",
            lg: "1240px",
          },
          mx: "auto",
          borderTop: "1px solid #E5E5E5",
        }}
      />

      {/* Top selling */}
      <TopSelling />
      <HappyCustomers />

      <DressStyle />
    </Box>
  );
}

export default Home;
