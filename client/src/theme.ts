import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },

    secondary: {
      main: "#666666",
    },

    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#000000",
      secondary: "#666666",
    },
  },

  typography: {
    fontFamily: "Arial, sans-serif",

    h1: {
      fontWeight: 700,
      fontSize: "64px",
      lineHeight: "64px",
    },

    h2: {
      fontWeight: 700,
    },

    h3: {
      fontWeight: 700,
    },

    h4: {
      fontWeight: 700,
    },

    h5: {
      fontWeight: 700,
    },

    h6: {
      fontWeight: 700,
    },

    body1: {
      fontSize: "16px",
      lineHeight: "22px",
    },
  },

  shape: {
    borderRadius: 8,
  },

  spacing: 8,
});

export default theme;
