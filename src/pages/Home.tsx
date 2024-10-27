import { Button, TextField, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { nanoid } from "nanoid";
import { useLocalStorage } from "../shared/useStorage";
import { AnimatedBackground } from "animated-backgrounds";
import { motion } from "framer-motion";

const maxNameLength = 20;

export const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useLocalStorage<User>("user", {
    id: nanoid(8),
    name: "",
    answer: null,
    points: 0,
    pointsHistory: [],
  });
  const [searchParams] = useSearchParams();
  const specificRoom = searchParams.get("room");

  const enterRoom = async (gameMode: GameMode) => {
    const roomId = specificRoom ?? nanoid(8);
    navigate(`/room/${roomId}`, { state: { gameMode } });
  };

  return (
    <main className="flex flex-col gap-3">
      <AnimatedBackground
        animationName="matrixRain"
        style={{
          opacity: 0.2,
        }}
      />
      <Typography
        variant="h1"
        color="primary"
        textAlign="center"
        fontFamily="Handjet, monospace"
        fontWeight={700}
        className="relative overflow-hidden"
      >
        Misfortune Engine
        <motion.span
          animate={{
            left: 2,
          }}
          initial={{
            left: -10,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
          className="absolute bottom-1 w-[110%] h-2 border-yellow-400/50 border-dashed border-[4px]"
        />
      </Typography>
      <div className="flex flex-col items-center justify-center mb-6">
        <Typography variant="body1" color="primary">
          How should I call you?
        </Typography>
        <div className="bg-yellow-100 rounded-md overflow-hidden [&_input]:pt-2 [&_input]:text-black-900">
          <TextField
            variant="filled"
            autoComplete="off"
            value={user.name}
            onChange={(e) =>
              e.target.value.length <= maxNameLength &&
              setUser({ ...user, name: e.target.value })
            }
          />
        </div>
      </div>
      {specificRoom ? (
        <div className="flex justify-evenly">
          <Button
            variant="contained"
            color="primary"
            onClick={() => enterRoom("versus")}
            disabled={!user.name.length}
          >
            Enter room
          </Button>
        </div>
      ) : (
        <>
          <Typography
            variant="h2"
            fontSize={20}
            fontWeight="bold"
            color="textPrimary"
            textAlign="center"
          >
            Game modes
          </Typography>
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
        </>
      )}
    </main>
  );
};
