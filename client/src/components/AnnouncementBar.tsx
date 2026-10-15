import { Box, Typography } from "@mui/material";

interface AnnouncementBarProps {
  onSignUp: () => void;
}

function AnnouncementBar({ onSignUp }: AnnouncementBarProps) {
  return (
    <Box
      sx={{
        backgroundColor: "primary.main",
        color: "common.white",
        textAlign: "center",
        py: 1,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: 400,
        }}
      >
        Sign up and get 20% off to your first order.{" "}
        <Box
          component="span"
          onClick={onSignUp}
          sx={{
            fontWeight: 600,
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Sign Up Now
        </Box>
      </Typography>
    </Box>
  );
}

export default AnnouncementBar;
