import { Realtime, useRealtime, useSuperviz } from "@superviz/react-sdk";
import { WaitingRoom } from "./WaitingRoom/WaitingRoom";
import { useCallback, useEffect, useRef, useState } from "react";
import { useBeforeUnload, useLocation, useParams } from "react-router-dom";
import { useLocalStorage } from "../../shared/useStorage";
import { DecidingMisfortune } from "./DecidingMisfortune/DecidingMisfortune";
import { AnsweringMisfortune } from "./AnsweringMisfortune/AnsweringMisfortune";
import { OutcomeShowcase } from "./OutcomeShowcase/OutcomeShowcase";
import { Leaderboard } from "./Leaderboard/Leaderboard";
import { Results } from "./Results/Results";

export type RoomScreenProps = {
  user: User;
  room: Room | null;
  userIsLeader: boolean;
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
  const roomRef = useRef(room);

  useEffect(() => {
    roomRef.current = room;
  }, [room]);

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
        if (payload.data.players[0].id === user.id) {
          if (
            payload.data.screen === "answeringMisfortune" &&
            payload.data.players.every((p) => p.answer)
          ) {
            realtime.publish("room:state", {
              ...payload.data,
              screen: "outcomeShowcase",
            });
          }
        }
      });
      realtime.subscribe("room:join", (payload: SubscribeCallback<User>) => {
        const room = roomRef.current;
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
        const room = roomRef.current;
        if (room?.players[0].id === user.id) {
          realtime.publish("room:state", {
            ...room,
            players: room?.players.filter((p) => p.id !== payload.data.id),
          });
        }
      });
      realtime.subscribe("room:answer", (payload: SubscribeCallback<User>) => {
        const room = roomRef.current;
        if (room?.players[0].id === user.id) {
          realtime.publish("room:state", {
            ...room,
            players: room?.players.map((p) =>
              p.id === payload.data.id ? payload.data : p
            ),
          });
        }
      });
      hasSubscribed.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realtime]);

  const screens: Record<RoomScreen, (props: RoomScreenProps) => JSX.Element> = {
    waitingRoom: WaitingRoom,
    decidingMisfortune: DecidingMisfortune,
    answeringMisfortune: AnsweringMisfortune,
    outcomeShowcase: OutcomeShowcase,
    leaderboard: Leaderboard,
    results: Results,
  };

  const ScreenComponent = screens[room?.screen || "waitingRoom"];

  return (
    <div>
      <ScreenComponent
        {...realtime}
        user={room?.players.find((p) => p.id === user?.id) || user!}
        room={room}
        userIsLeader={!!(user && room?.players[0].id === user.id)}
      />
      <div className="absolute">
        <Realtime />
      </div>
    </div>
  );
};
