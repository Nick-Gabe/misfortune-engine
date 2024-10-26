import { useSuperviz } from "@superviz/react-sdk";
import { WaitingRoom } from "./WaitingRoom/WaitingRoom";
import { useCallback, useState } from "react";
import { useBeforeUnload } from "react-router-dom";

type RoomScreen = "waitingRoom";

export const RoomWithoutProviders = () => {
  const { stopRoom, hasJoinedRoom } = useSuperviz();

  const beforeUnload = useCallback(() => {
    if (hasJoinedRoom) {
      stopRoom();
    }
  }, [hasJoinedRoom, stopRoom]);

  useBeforeUnload(beforeUnload);

  const [roomScreen] = useState<RoomScreen>("waitingRoom");

  const screens = {
    waitingRoom: WaitingRoom,
  };

  const ScreenComponent = screens[roomScreen];

  return <ScreenComponent />;
};
