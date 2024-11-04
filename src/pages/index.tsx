import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Home } from "./Home";
import { Room } from "./Room";
import {
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
} from "@mui/material";
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

  const changeLanguage = (e: SelectChangeEvent) => {
    const language = e.target.value as string;
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
  };

  return (
    <div className="flex w-full h-10-dvh justify-between p-5 md:fixed top-0 right-0">
      <div className="flex">
        <label htmlFor="language" className="w-0 h-0 invisible">
          {t("language")}
        </label>
        <Select
          className="w-20 h-10 !text-2xl bg-yellow-50/10"
          id="language"
          value={i18n.language}
          onChange={changeLanguage}
        >
          <MenuItem value="en">🇺🇸</MenuItem>
          <MenuItem value="pt-BR">🇧🇷</MenuItem>
        </Select>
      </div>
      <div className="flex items-start">
        {location.pathname !== "/" && (
          <Tooltip title={t("common.exitRoom")}>
            <IconButton color="primary" className="!p-0">
              <a href="/">
                <ExitToApp fontSize="large" />
              </a>
            </IconButton>
          </Tooltip>
        )}
      </div>
    </div>
  );
};
