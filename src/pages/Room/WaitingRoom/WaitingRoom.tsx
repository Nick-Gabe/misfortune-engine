import { Button, Snackbar } from "@mui/material";
import { GamemodeDescription } from "./GamemodeDescription";
import { PlayerList } from "./PlayerList";
import { useState } from "react";
import { RoomScreenProps } from "../Room";
import { LeaderButton } from "../../../components/LeaderContinueButton";
import { useTranslation } from "react-i18next";

export const WaitingRoom = ({
  room,
  publish,
  userIsLeader,
}: RoomScreenProps) => {
  const { t } = useTranslation();
  const [showCopiedLink, setShowCopiedLink] = useState(false);

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

  return (
    <main className="flex flex-col gap-10 items-center">
      <div className="grid grid-cols-2 gap-10 px-5">
        <PlayerList players={room?.players || []} onCopyLink={shareRoom} />
        <GamemodeDescription gamemode="versus" />
      </div>
      <div className="flex gap-5">
        <Button variant="outlined" color="primary" onClick={shareRoom}>
          {t("pages.waitingRoom.shareRoomButton")}
        </Button>
        <LeaderButton
          onClick={startGame}
          userIsLeader={userIsLeader}
          disabled={!room || room.players.length < 2}
        >
          {t("pages.waitingRoom.startGame")}
        </LeaderButton>
      </div>
      <Snackbar
        open={showCopiedLink}
        message={t("pages.waitingRoom.roomLinkCopied")}
        autoHideDuration={3000}
        onClose={(_, reason) => {
          if (reason === "clickaway") return;
          setShowCopiedLink(false);
        }}
      />
    </main>
  );
};
