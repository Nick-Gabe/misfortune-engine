import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Pages } from "./pages";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#fbbf24",
    },
    secondary: {
      main: "#f50057",
    },
    error: {
      main: "#f44336",
    },
    text: {
      primary: "#f9fafb",
      secondary: "#d1d5db",
    },
    background: {
      default: "#1e293b",
      paper: "#334155",
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <Pages />
    </ThemeProvider>
  </StrictMode>
);
