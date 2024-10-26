import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./Home";
import { Room } from "./Room/Room";

export const Pages = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:id" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
};
