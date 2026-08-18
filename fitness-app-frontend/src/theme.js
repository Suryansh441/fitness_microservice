import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    background: { default: "#F4F6F5", paper: "#FFFFFF" },
    text: { primary: "#16211D", secondary: "#4A5854" },
    primary: { main: "#FF8A00", contrastText: "#16211D" },   // amber — actions
    secondary: { main: "#0B5D52", contrastText: "#FFFFFF" }, // teal — data
    divider: "#DDE3E1",
  },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", sans-serif',
    h5: { fontFamily: '"Space Grotesk", "Inter", sans-serif', fontWeight: 700 },
    h6: { fontFamily: '"Space Grotesk", "Inter", sans-serif', fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: { root: { boxShadow: "none" } },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #DDE3E1",
          boxShadow: "0 1px 2px rgba(22,33,29,0.04)",
        },
      },
    },
  },
});

export default theme;