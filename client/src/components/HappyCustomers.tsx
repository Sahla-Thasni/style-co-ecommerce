import { useRef } from "react";
import {
  ArrowBackIosNew,
  ArrowForwardIos,
  CheckCircle,
} from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";

// Happy customers section
function HappyCustomers() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const customers = [
    {
      name: "Sarah M.",
      review:
        "I'm blown away by the quality and style of the clothes I received from Style.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
    },
    {
      name: "Alex K.",
      review:
        "Finding clothes that align with my personal style used to be a challenge until I discovered Style.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
    },
    {
      name: "James L.",
      review:
        "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Style.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
    },
    {
      name: "Michael R.",
      review:
        "Style.co has completely changed the way I shop for clothes. The quality is excellent and the designs are always stylish.",
    },
    {
      name: "Emma W.",
      review:
        "I love shopping at Style.co. The clothes are comfortable, fashionable and the quality is better than I expected.",
    },
  ];

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;

    container.scrollBy({
      left:
        direction === "right" ? container.clientWidth : -container.clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        mt: {
          xs: "40px",
          sm: "50px",
          md: "60px",
          lg: "70px",
        },
        mb: {
          xs: "40px",
          sm: "50px",
          md: "60px",
          lg: "70px",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          width: {
            xs: "calc(100% - 32px)",
            sm: "calc(100% - 40px)",
            md: "850px",
            lg: "1240px",
          },
          mx: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: {
            xs: "20px",
            md: "24px",
            lg: "28px",
          },
        }}
      >
        <Typography
          sx={{
            fontFamily: '"Arial Black", Arial, sans-serif',
            fontWeight: 900,
            fontSize: {
              xs: "24px",
              sm: "30px",
              md: "36px",
              lg: "40px",
            },
            lineHeight: 1.1,
          }}
        >
          OUR HAPPY CUSTOMERS
        </Typography>

        {/* Arrows */}
        <Box
          sx={{
            display: "flex",
            gap: "6px",
          }}
        >
          <IconButton
            onClick={() => handleScroll("left")}
            sx={{
              width: "32px",
              height: "32px",
              color: "#000000",
            }}
          >
            <ArrowBackIosNew
              sx={{
                fontSize: "15px",
              }}
            />
          </IconButton>

          <IconButton
            onClick={() => handleScroll("right")}
            sx={{
              width: "32px",
              height: "32px",
              color: "#000000",
            }}
          >
            <ArrowForwardIos
              sx={{
                fontSize: "15px",
              }}
            />
          </IconButton>
        </Box>
      </Box>

      {/* Customer cards */}
      <Box
        ref={scrollRef}
        sx={{
          width: {
            xs: "calc(100% - 32px)",
            sm: "calc(100% - 40px)",
            md: "850px",
            lg: "1240px",
          },
          mx: "auto",
          overflowX: "auto",
          overflowY: "hidden",
          scrollbarWidth: "none",

          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: {
              xs: "12px",
              sm: "16px",
              md: "16px",
              lg: "16px",
            },
          }}
        >
          {customers.map((customer) => (
            <Box
              key={customer.name}
              sx={{
                flex: "0 0 auto",

                width: {
                  xs: "calc(100vw - 32px)",
                  sm: "calc((100vw - 56px) / 2)",
                  md: "calc((850px - 16px) / 2)",
                  lg: "calc((1240px - 32px) / 3)",
                },

                minHeight: {
                  xs: "190px",
                  sm: "180px",
                  md: "150px",
                  lg: "150px",
                },

                border: "1px solid #E5E5E5",
                borderRadius: "14px",
                backgroundColor: "#FFFFFF",
                px: {
                  xs: "16px",
                  sm: "18px",
                  md: "20px",
                  lg: "20px",
                },
                py: "18px",
                boxSizing: "border-box",

                scrollSnapAlign: "start",
              }}
            >
              {/* Rating */}
              <Typography
                sx={{
                  color: "#FFC633",
                  fontSize: "17px",
                  letterSpacing: "2px",
                  lineHeight: 1,
                  mb: "10px",
                }}
              >
                ★★★★★
              </Typography>

              {/* Customer name */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  mb: "8px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  {customer.name}
                </Typography>

                <CheckCircle
                  sx={{
                    fontSize: "13px",
                    color: "#00A63C",
                  }}
                />
              </Box>

              {/* Review */}
              <Typography
                sx={{
                  fontSize: "10px",
                  lineHeight: "15px",
                  color: "#666666",
                }}
              >
                "{customer.review}"
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default HappyCustomers;
