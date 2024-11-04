import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Home } from "./Home";
import { Room } from "./Room";
import { IconButton, MenuItem, Select, Tooltip } from "@mui/material";
import { ExitToApp } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export const Pages = () => {
  return (
    <BrowserRouter>
      <StaticButtons />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:id" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
};

const StaticButtons = () => {
  const location = useLocation();
  const { i18n, t } = useTranslation();

  if (location.pathname === "/") {
    return null;
  }

  return (
    <>
      <div className="fixed top-5 right-5">
        <Tooltip title="Exit room">
          <IconButton color="primary">
            <a href="/">
              <ExitToApp fontSize="large" />
            </a>
          </IconButton>
        </Tooltip>
      </div>
      <div className="flex fixed left-5 top-5">
        <label htmlFor="language" className="w-0 h-0 invisible">
          {t("language")}
        </label>
        <Select
          className="w-20 h-10 !text-2xl bg-yellow-50/10"
          id="language"
          value={i18n.language.includes("pt") ? "pt-br" : "en"}
          onChange={(e) => i18n.changeLanguage(e.target.value as string)}
        >
          <MenuItem value="en">🇺🇸</MenuItem>
          <MenuItem value="pt-br">🇧🇷</MenuItem>
        </Select>
      </div>
    </>
  );
};
