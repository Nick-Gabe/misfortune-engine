import { Typography } from "@mui/material";
import { useLocalStorage } from "../../../shared/useStorage";
import { motion, AnimatePresence } from "framer-motion";
import { Crown } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

type PlayerListProps = {
  players: User[];
  onCopyLink: () => void;
};

export const PlayerList = (props: PlayerListProps) => {
  const { t } = useTranslation();
  const [user] = useLocalStorage<User | null>("user", null);

  return (
    <div className="flex flex-col gap-2">
      <Typography variant="h3" fontWeight="bold" color="primary">
        {t("common.players")}
      </Typography>

      <AnimatePresence>
        {props.players.map((player) => {
          const playerIsLeader = props.players[0].id === player.id;
          return (
            <motion.div
              key={player.id}
              className={`${
                user?.id === player.id ? "bg-slate-400" : "bg-slate-500"
              } flex items-center gap-2 p-4 rounded-lg`}
              initial={{ height: 0 }}
              animate={{ height: 56 }}
              exit={{ height: 0 }}
            >
              {playerIsLeader && (
                <Crown
                  weight="fill"
                  size={20}
                  className="text-yellow-400"
                  stroke="black"
                  strokeWidth={10}
                />
              )}
              <Typography variant="body1" fontWeight="bold">
                {player.name}
              </Typography>
            </motion.div>
          );
        })}
      </AnimatePresence>
      <button
        className="flex items-center gap-2 bg-transparent border-2 border-slate-500 p-4 rounded-lg text-slate-400 border-dashed hover:bg-slate-700"
        onClick={props.onCopyLink}
      >
        <Typography variant="body1">
          {t("pages.room.shareRoomListButton")}
        </Typography>
      </button>
    </div>
  );
};
