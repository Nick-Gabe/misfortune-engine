import { Button, Snackbar } from "@mui/material";
import { GamemodeDescription } from "./GamemodeDescription";
import { PlayerList } from "./PlayerList";
import { useState } from "react";
import { RoomScreenProps } from "../Room";
import { useLocalStorage } from "../../../shared/useStorage";

export const WaitingRoom = ({ room, publish }: RoomScreenProps) => {
  const [showCopiedLink, setShowCopiedLink] = useState(false);
  const [user] = useLocalStorage<User | null>("user", null);

  const shareRoom = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopiedLink(true);
  };

  const startGame = () => {
    publish("room:state", {
      ...room,
      screen: "decidingMisfortune",
    });
  };

  const userCanStartGame =
    room && room.players.length > 1 && room.players[0].id === user?.id;

  return (
    <main className="flex flex-col gap-10 items-center">
      <div className="grid grid-cols-2 gap-10 px-5">
        <PlayerList players={room?.players || []} onCopyLink={shareRoom} />
        <GamemodeDescription gamemode="versus" />
      </div>
      <div className="flex gap-5">
        <Button variant="outlined" color="primary" onClick={shareRoom}>
          Share room
        </Button>
        <Button
          variant="contained"
          className={!userCanStartGame ? `!bg-slate-600` : ""}
          color="primary"
          onClick={userCanStartGame ? startGame : undefined}
        >
          Start Game
        </Button>
      </div>
      <Snackbar
        open={showCopiedLink}
        message="Room link copied to clipboard"
        autoHideDuration={3000}
        onClose={(_, reason) => {
          if (reason === "clickaway") return;
          setShowCopiedLink(false);
        }}
      />
    </main>
  );
};
