import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Home } from "./Home";
import { Room } from "./Room";
import { IconButton, Tooltip } from "@mui/material";
import { ExitToApp } from "@mui/icons-material";

export const Pages = () => {
  return (
    <BrowserRouter>
      <ExitRoomButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:id" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
};

const ExitRoomButton = () => {
  const location = useLocation();

  if (location.pathname === "/") {
    return null;
  }

  return (
    <div className="fixed top-5 right-5">
      <Tooltip title="Exit room">
        <IconButton color="primary">
          <Link to="/">
            <ExitToApp fontSize="large" />
          </Link>
        </IconButton>
      </Tooltip>
    </div>
  );
};
