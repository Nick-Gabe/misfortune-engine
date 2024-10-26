import { WaitingRoom } from "./WaitingRoom/WaitingRoom";
import { useState } from "react";

type RoomScreen = "waitingRoom";

export const RoomWithoutProviders = () => {
  const [roomScreen] = useState<RoomScreen>("waitingRoom");

  const screens = {
    waitingRoom: WaitingRoom,
  };

  const ScreenComponent = screens[roomScreen];

  return <ScreenComponent />;
};
