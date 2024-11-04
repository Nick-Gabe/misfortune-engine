import {
  Realtime,
  useRealtime,
  useSuperviz,
  VideoConference,
} from "@superviz/react-sdk";
import { WaitingRoom } from "./WaitingRoom/WaitingRoom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const [videoMounted, setVideoMounted] = useState(false);
  const roomRef = useRef(room);
  const containerRef = useRef<HTMLDivElement>(null);

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
            payload.data.players.every((p) => p.answer !== null)
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
          // Sometimes the user refreshed the page, so instead of adding a new player,
          // we just maintain the existing one and publish the state so the user syncs.
          const userIsAlreadyInRoom = room.players.some(
            (p) => p.id === payload.data.id
          );
          realtime.publish("room:state", {
            ...room,
            players: userIsAlreadyInRoom
              ? room.players
              : [...room.players, payload.data],
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

  // If the user doesn't join in 10 seconds, some connection error happened, so we reload the page.
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!realtime.isReady) {
        window.location.reload();
      }
    }, 10000); // 10 seconds

    return () => clearTimeout(timeout);
  }, [realtime.isReady]);

  const screens: Record<RoomScreen, (props: RoomScreenProps) => JSX.Element> = {
    waitingRoom: WaitingRoom,
    decidingMisfortune: DecidingMisfortune,
    answeringMisfortune: AnsweringMisfortune,
    outcomeShowcase: OutcomeShowcase,
    leaderboard: Leaderboard,
    results: Results,
  };

  const ScreenComponent = screens[room?.screen || "waitingRoom"];

  const userIsOnDesktop = useMemo(() => window.innerWidth > 768, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!userIsOnDesktop || !container || !videoMounted) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const { height } = entries[0].contentRect;
      container.style.maxHeight = `calc(100% - ${height}px)`;
    });
    const videoFrame = document.getElementById("sv-video-frame");
    observer.observe(videoFrame!);
    return () => {
      observer.disconnect();
    };
  }, [videoMounted, userIsOnDesktop]);

  return (
    <div
      className="h-90-dvh md:h-screen w-full flex flex-col md:justify-center items-center"
      style={{
        transition: "max-height 0.3s ease",
      }}
      ref={containerRef}
    >
      <ScreenComponent
        {...realtime}
        user={room?.players.find((p) => p.id === user?.id) || user!}
        room={room}
        userIsLeader={!!(user && room?.players[0].id === user.id)}
      />
      <div className="absolute">
        <Realtime />
      </div>
      {userIsOnDesktop && (
        <VideoConference
          participantType="host"
          enableRecording={false}
          skipMeetingSettings
          allowGuests
          screenshareOff
          onMount={() => setVideoMounted(true)}
          onMeetingStart={() => setVideoMounted(true)}
          collaborationMode={{
            enabled: true,
            position: "bottom",
          }}
        />
      )}
    </div>
  );
};
