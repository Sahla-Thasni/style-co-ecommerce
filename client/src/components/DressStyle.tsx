import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import {
  casualImage,
  formalImage,
  partyImage,
  gymImage,
} from "../assets/dress-style";

// Dress style section
function DressStyle() {
  const navigate = useNavigate();

  const styles = [
    {
      name: "Casual",
      image: casualImage,
      className: "casual",
    },
    {
      name: "Formal",
      image: formalImage,
      className: "formal",
    },
    {
      name: "Party",
      image: partyImage,
      className: "party",
    },
    {
      name: "Gym",
      image: gymImage,
      className: "gym",
    },
  ];

  return (
    <Box
      sx={{
        width: {
          xs: "calc(100% - 32px)",
          sm: "calc(100% - 40px)",
          md: "850px",
          lg: "1240px",
        },
        mx: "auto",
        backgroundColor: "#F0F0F0",
        borderRadius: {
          xs: "14px",
          md: "18px",
          lg: "20px",
        },
        px: {
          xs: "16px",
          sm: "24px",
          md: "40px",
          lg: "50px",
        },
        py: {
          xs: "24px",
          sm: "32px",
          md: "40px",
          lg: "70px",
        },
        mt: {
          xs: "40px",
          md: "50px",
          lg: "60px",
        },
        mb: {
          xs: "40px",
          md: "50px",
          lg: "60px",
        },
      }}
    >
      {/* Section heading */}

      <Typography
        sx={{
          textAlign: "center",
          fontFamily: '"Arial Black", Arial, sans-serif',
          fontWeight: 900,
          fontSize: {
            xs: "28px",
            sm: "32px",
            md: "40px",
            lg: "48px",
          },
          lineHeight: {
            xs: "30px",
            sm: "34px",
            md: "42px",
            lg: "50px",
          },
          py: {
            xs: "16px",
            sm: "20px",
            md: "20px",
            lg: "20px",
          },
          mb: {
            xs: "16px",
            sm: "20px",
            md: "24px",
            lg: "28px",
          },
        }}
      >
        BROWSE BY DRESS STYLE
      </Typography>
      {/* Dress style cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr",
            md: "repeat(3, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          py: "10px",
          gap: {
            xs: "12px",
            sm: "16px",
            md: "20px",
            lg: "20px",
          },
        }}
      >
        {styles.map((style, index) => (
          <Box
            key={style.name}
            onClick={() =>
              navigate(`/category?style=${encodeURIComponent(style.name)}`)
            }
            sx={{
              position: "relative",

              height: {
                xs: "140px",
                sm: "160px",
                md: "200px",
                lg: "220px",
              },
              borderRadius: "10px",
              overflow: "hidden",
              backgroundColor: "#FFFFFF",
              cursor: "pointer",

              // Casual
              ...(index === 0 && {
                gridColumn: {
                  md: "span 1",
                  lg: "span 1",
                },
              }),

              // Formal
              ...(index === 1 && {
                gridColumn: {
                  md: "span 2",
                  lg: "span 2",
                },
              }),

              // Party
              ...(index === 2 && {
                gridColumn: {
                  md: "span 2",
                  lg: "span 2",
                },
              }),

              // Gym
              ...(index === 3 && {
                gridColumn: {
                  md: "span 1",
                  lg: "span 1",
                },
              }),
            }}
          >
            <Box
              component="img"
              src={style.image}
              alt={style.name}
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

            <Typography
              sx={{
                position: "absolute",
                top: {
                  xs: "12px",
                  md: "14px",
                  lg: "16px",
                },
                left: {
                  xs: "12px",
                  md: "14px",
                  lg: "16px",
                },
                fontSize: {
                  xs: "14px",
                  sm: "15px",
                  md: "16px",
                  lg: "16px",
                },
                fontWeight: 500,
                color: "#000000",
                zIndex: 1,
              }}
            >
              {style.name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default DressStyle;
