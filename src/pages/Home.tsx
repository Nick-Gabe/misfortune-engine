import { Button, TextField, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { nanoid } from "nanoid";
import { useLocalStorage } from "../shared/useStorage";
import { AnimatedBackground } from "animated-backgrounds";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const maxNameLength = 20;

export const Home = () => {
  const { t } = useTranslation();
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
    <main className="h-[90vh] w-full flex flex-col items-center justify-center gap-3">
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
          {t("pages.home.nameLabel")}
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
            {t("pages.home.joinRoom")}
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
            {t("common.gamemodes")}
          </Typography>
          <div className="flex justify-evenly">
            <Button
              variant="contained"
              color="primary"
              onClick={() => enterRoom("versus")}
              disabled={!user.name.length}
            >
              {t("common.versus")}
            </Button>
          </div>
        </>
      )}
    </main>
  );
};
