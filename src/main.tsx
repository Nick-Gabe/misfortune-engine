import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Pages } from "./pages";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Pages />
  </StrictMode>
);
