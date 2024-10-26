import { Button, Snackbar } from "@mui/material";
import { GamemodeDescription } from "./GamemodeDescription";
import { PlayerList } from "./PlayerList";
import { useState } from "react";

export const WaitingRoom = () => {
  const [showCopiedLink, setShowCopiedLink] = useState(false);

  const shareRoom = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopiedLink(true);
  };

  return (
    <main className="flex flex-col gap-10 items-center">
      <div className="grid grid-cols-2 gap-10">
        <PlayerList
          players={[
            {
              id: "1",
              name: "Player 1",
            },
            {
              id: "2",
              name: "Player 2",
            },
          ]}
          onCopyLink={shareRoom}
        />
        <GamemodeDescription gamemode="versus" />
      </div>
      <div className="flex gap-5">
        <Button variant="outlined" color="primary" onClick={shareRoom}>
          Share room
        </Button>
        <Button variant="contained" color="primary">
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
