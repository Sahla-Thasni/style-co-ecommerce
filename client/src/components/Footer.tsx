import {
  EmailOutlined,
  Facebook,
  Instagram,
  Pinterest,
  Twitter,
} from "@mui/icons-material";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";

import {
  visaLogo,
  mastercardLogo,
  paypalLogo,
  applePayLogo,
  googlePayLogo,
} from "../assets/footer";

// Footer component
function Footer() {
  const footerLinks = [
    {
      title: "COMPANY",
      links: ["About", "Features", "Works", "Career"],
    },
    {
      title: "HELP",
      links: [
        "Customer Support",
        "Delivery Details",
        "Terms & Conditions",
        "Privacy Policy",
      ],
    },
    {
      title: "FAQ",
      links: ["Account", "Manage Deliveries", "Orders", "Payments"],
    },
    {
      title: "RESOURCES",
      links: [
        "Free eBooks",
        "Development Tutorial",
        "How to - Blog",
        "Youtube Playlist",
      ],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        backgroundColor: "#F0F0F0",
        mt: {
          xs: "40px",
          md: "60px",
          lg: "80px",
        },
      }}
    >
      {/* Newsletter section */}
      <Box
        sx={{
          width: {
            xs: "calc(100% - 26px)",
            sm: "calc(100% - 40px)",
            md: "calc(100% - 64px)",
            lg: "1240px",
          },
          maxWidth: {
            xs: "none",
            sm: "776px",
            md: "900px",
            lg: "1240px",
          },
          mx: "auto",
          backgroundColor: "#000000",
          borderRadius: {
            xs: "14px",
            lg: "14px",
          },
          px: {
            xs: "15px",
            sm: "30px",
            md: "40px",
            lg: "40px",
          },
          py: {
            xs: "18px",
            sm: "24px",
            md: "28px",
            lg: "22px",
          },
          transform: {
            xs: "translateY(-10px)",
            sm: "translateY(-25px)",
            md: "translateY(-35px)",
            lg: "translateY(-55px)",
          },
          display: "flex",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          alignItems: {
            xs: "stretch",
            md: "center",
          },
          justifyContent: "space-between",
          gap: {
            xs: "16px",
            lg: "30px",
          },
        }}
      >
        {/* Newsletter heading */}
        <Typography
          sx={{
            color: "#FFFFFF",
            fontWeight: 700,
            fontSize: {
              xs: "22px",
              sm: "26px",
              md: "30px",
              lg: "30px",
            },
            lineHeight: {
              xs: "24px",
              sm: "28px",
              md: "32px",
              lg: "30px",
            },
            maxWidth: {
              xs: "100%",
              lg: "430px",
            },
          }}
        >
          STAY UP TO DATE ABOUT
          <br />
          OUR LATEST OFFERS
        </Typography>

        {/* Newsletter form */}
        <Box
          sx={{
            width: {
              xs: "100%",
              lg: "218px",
            },
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <TextField
            fullWidth
            placeholder="Enter your email address"
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <EmailOutlined
                    sx={{
                      fontSize: "15px",
                      color: "#999999",
                      mr: "7px",
                    }}
                  />
                ),
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "30px",
                backgroundColor: "#FFFFFF",
                borderRadius: "20px",
                fontSize: "9px",
                px: "10px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& input": {
                padding: "0",
              },
            }}
          />

          <Button
            fullWidth
            sx={{
              height: "30px",
              backgroundColor: "#FFFFFF",
              color: "#000000",
              borderRadius: "20px",
              textTransform: "none",
              fontSize: "9px",
              "&:hover": {
                backgroundColor: "#FFFFFF",
              },
            }}
          >
            Subscribe to Newsletter
          </Button>
        </Box>
      </Box>

      {/* Main footer content */}
      <Box
        sx={{
          width: {
            xs: "calc(100% - 26px)",
            sm: "calc(100% - 26px)",
            md: "calc(100% - 48px)",
            lg: "1240px",
          },
          maxWidth: {
            xs: "none",
            sm: "none",
            md: "none",
            lg: "1240px",
          },
          mx: "auto",
          mt: {
            xs: "-2px",
            sm: "-10px",
            md: "-15px",
            lg: "-25px",
          },
          pb: {
            xs: "20px",
            sm: "24px",
            md: "28px",
            lg: "28px",
          },
        }}
      >
        {/* Footer columns */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              sm: "1fr 1fr",
              md: "1.3fr 1fr 1fr 1fr",
              lg: "1.6fr 1fr 1fr 1fr 1.2fr",
            },
            columnGap: {
              xs: "25px",
              sm: "30px",
              md: "24px",
              lg: "45px",
            },
            rowGap: {
              xs: "20px",
              lg: "0",
            },
          }}
        >
          {/* Brand section */}
          <Box
            sx={{
              gridColumn: {
                xs: "1 / -1",
                sm: "1 / -1",
                md: "auto",
              },
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "20px",
                  lg: "22px",
                },
                fontWeight: 700,
                mb: "8px",
              }}
            >
              STYLE.CO
            </Typography>

            <Typography
              sx={{
                maxWidth: "240px",
                fontSize: "10px",
                lineHeight: "16px",
                color: "#666666",
              }}
            >
              We have clothes that suits your style and which you're proud to
              wear. From women to men.
            </Typography>

            {/* Social icons */}
            <Box
              sx={{
                display: "flex",
                gap: "5px",
                mt: "12px",
              }}
            >
              {[Twitter, Facebook, Instagram, Pinterest].map((Icon, index) => (
                <IconButton
                  key={index}
                  size="small"
                  sx={{
                    width: "18px",
                    height: "18px",
                    backgroundColor: index === 1 ? "#000000" : "#FFFFFF",
                    border: "1px solid #D9D9D9",
                    "&:hover": {
                      backgroundColor: index === 1 ? "#000000" : "#FFFFFF",
                    },
                  }}
                >
                  <Icon
                    sx={{
                      fontSize: "10px",
                      color: index === 1 ? "#FFFFFF" : "#000000",
                    }}
                  />
                </IconButton>
              ))}
            </Box>
          </Box>

          {/* Footer links */}
          {footerLinks.map((section) => (
            <Box key={section.title}>
              <Typography
                sx={{
                  fontSize: "10px",
                  letterSpacing: "2px",
                  fontWeight: 500,
                  mb: "12px",
                }}
              >
                {section.title}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {section.links.map((link) => (
                  <Typography
                    key={link}
                    sx={{
                      fontSize: "10px",
                      color: "#666666",
                      cursor: "pointer",
                    }}
                  >
                    {link}
                  </Typography>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Bottom divider */}
        <Box
          sx={{
            borderTop: "1px solid #D9D9D9",
            mt: {
              xs: "20px",
              lg: "28px",
            },
            pt: {
              xs: "12px",
              lg: "12px",
            },
            display: "flex",
            flexDirection: {
              xs: "column",
              lg: "row",
            },
            alignItems: {
              xs: "center",
              lg: "center",
            },
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          {/* Copyright */}
          <Typography
            sx={{
              fontSize: "9px",
              color: "#666666",
            }}
          >
            Style.co © 2000-2026, All Rights Reserved
          </Typography>

          {/* Payment logos */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Box
              component="img"
              src={visaLogo}
              alt="Visa"
              sx={{ width: "32px", height: "20px" }}
            />

            <Box
              component="img"
              src={mastercardLogo}
              alt="Mastercard"
              sx={{ width: "32px", height: "20px" }}
            />

            <Box
              component="img"
              src={paypalLogo}
              alt="PayPal"
              sx={{ width: "32px", height: "20px" }}
            />

            <Box
              component="img"
              src={applePayLogo}
              alt="Apple Pay"
              sx={{ width: "32px", height: "20px" }}
            />

            <Box
              component="img"
              src={googlePayLogo}
              alt="Google Pay"
              sx={{ width: "32px", height: "20px" }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;
