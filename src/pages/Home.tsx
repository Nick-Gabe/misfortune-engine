import { Button, TextField, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { nanoid } from "nanoid";
import { useLocalStorage } from "../shared/useStorage";

export const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useLocalStorage<User>("user", {
    id: nanoid(8),
    name: "",
    answer: null,
    points: 0,
  });
  const [searchParams] = useSearchParams();
  const specificRoom = searchParams.get("room");

  const enterRoom = async (gameMode: GameMode) => {
    const roomId = specificRoom ?? nanoid(8);
    navigate(`/room/${roomId}`, { state: { gameMode } });
  };

  return (
    <main className="flex flex-col gap-3">
      <Typography variant="h1" color="primary" textAlign="center">
        Misfortune Engine
      </Typography>
      <div className="flex flex-col items-center justify-center mb-6">
        <Typography variant="body1" color="primary">
          Who are you?
        </Typography>
        <div className="bg-yellow-100 rounded-md overflow-hidden [&_input]:pt-2 [&_input]:text-black-900">
          <TextField
            variant="filled"
            autoComplete="off"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </div>
      </div>
      <div className="flex justify-evenly">
        <Button
          variant="contained"
          color="primary"
          onClick={() => enterRoom("versus")}
          disabled={!user.name.length}
        >
          Versus
        </Button>
      </div>
    </main>
  );
};
