import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Pages } from "./pages";
import { createTheme, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
import i18n from "./i18n";
import { I18nextProvider } from "react-i18next";

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

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          <Pages />
        </I18nextProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
