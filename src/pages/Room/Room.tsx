import { Realtime, useRealtime, useSuperviz } from "@superviz/react-sdk";
import { WaitingRoom } from "./WaitingRoom/WaitingRoom";
import { useCallback, useEffect, useRef, useState } from "react";
import { useBeforeUnload, useLocation, useParams } from "react-router-dom";
import { useLocalStorage } from "../../shared/useStorage";

export type RoomScreenProps = {
  user: User;
  room: Room | null;
} & ReturnType<typeof useRealtime>;

type SubscribeCallback<T> = {
  data: T;
  name: string;
  participantId: string;
};

export const RoomWithoutProviders = () => {
  const { id: roomId = "" } = useParams();
  const { stopRoom, hasJoinedRoom } = useSuperviz();
  const location = useLocation();
  const realtime = useRealtime(roomId);
  const hasSubscribed = useRef(false);

  const [user] = useLocalStorage<User | null>("user", null);
  const [room, setRoom] = useState<Room | null>({
    id: roomId,
    screen: "waitingRoom",
    players: user ? [user] : [],
    gameMode: location.state?.gameMode || "versus",
  });

  const beforeUnload = useCallback(() => {
    if (hasJoinedRoom) {
      realtime.publish("room:leave", user);
      stopRoom();
    }
  }, [hasJoinedRoom, realtime, user, stopRoom]);
  useBeforeUnload(beforeUnload);

  useEffect(() => {
    if (realtime.isReady && user && !hasSubscribed.current) {
      realtime.publish("room:join", user);
      realtime.subscribe("room:state", (payload: SubscribeCallback<Room>) => {
        console.log("👝 state", payload);
        setRoom(payload.data);
      });
      realtime.subscribe("room:join", (payload: SubscribeCallback<User>) => {
        if (payload.data.id === user.id) {
          return;
        }
        if (room?.players[0].id === user.id) {
          realtime.publish("room:state", {
            ...room,
            players: [...(room?.players || []), payload.data],
          });
        }
      });
      realtime.subscribe("room:leave", (payload: SubscribeCallback<User>) => {
        if (room?.players[0].id === user.id) {
          realtime.publish("room:state", {
            ...room,
            players: room?.players.filter((p) => p.id !== payload.data.id),
          });
        }
      });
      hasSubscribed.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realtime]);

  const screens = {
    waitingRoom: WaitingRoom,
  };

  const ScreenComponent = screens[room?.screen || "waitingRoom"];

  return (
    <div>
      <ScreenComponent {...realtime} user={user!} room={room} />;
      <div className="absolute">
        <Realtime />
      </div>
    </div>
  );
};
