import { Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { useLocalStorage } from "../shared/useStorage";

export const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useLocalStorage("user", {
    id: nanoid(5),
    name: "",
  });

  const enterRoom = () => {
    navigate(`/room/${nanoid(5)}`);
  };

  return (
    <main className="flex flex-col gap-3">
      <Typography variant="h1" color="primary">
        Infortune Engine
      </Typography>
      <div className="flex flex-col items-center justify-center mb-6">
        <Typography variant="body1" color="primary">
          Who are you?
        </Typography>
        <div className="bg-yellow-100 rounded-md overflow-hidden [&_input]:pt-2">
          <TextField
            variant="filled"
            autoComplete="off"
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </div>
      </div>
      <div className="flex justify-evenly">
        {/* <Button
          variant="contained"
          color="primary"
          onClick={enterRoom}
          disabled={!user.name.length}
        >
          CO-OP
        </Button> */}
        <Button
          variant="contained"
          color="primary"
          onClick={enterRoom}
          disabled={!user.name.length}
        >
          Versus
        </Button>
      </div>
    </main>
  );
};
